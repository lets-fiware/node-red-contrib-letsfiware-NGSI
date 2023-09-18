#!/bin/bash

# MIT License
#
# Copyright 2023 Kazuhito Suda
#
# This file is part of node-red-contrib-NGSI-LD
#
# https://github.com/lets-fiware/node-red-contrib-NGSI-LD
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

set -Ceuo pipefail

WAIT_TIME=300

#
# wait for serive
#
wait() {
  local host
  local ret

  host=$1
  ret=$2

  echo "Wait for ${host} to be ready (${WAIT_TIME} sec)" 1>&2

  for i in $(seq "${WAIT_TIME}")
  do
    # shellcheck disable=SC2086
    if [ "${ret}" == "$(curl ${host} -o /dev/null -w '%{http_code}\n' -s)" ]; then
      echo "${host} is ready."
      return
    fi
    sleep 1
  done

  exit 1
}

# Setup node-RED
npm install node-red@3.0.2
npm ci
npm link node-red-contrib-letsfiware-ngsi
./node_modules/node-red/red.js &

# Setup containers
cd ./test/e2e

# Pull containers
docker compose pull

# Start up containers
docker compose up -d

# Wait for services
wait "http://localhost:1026/version" "200"
wait "http://localhost:1880/settings" "200"

# Upload flows to Node-RED
curl -sL http://localhost:1880/flows --data @e2e-flows.json --header 'Content-type:application/json'
