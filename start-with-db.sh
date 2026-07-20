#!/bin/bash
cd /home/team/shared/site
export $(cat .env | xargs)
exec bun run start
