#!/usr/bin/env bash
gunicorn --bind unix:/tmp/RAScheduler.sock --access-logfile /var/log/gunicorn/scheduler-access.log --error-logfile /var/log/gunicorn/scheduler-error.log main:app &