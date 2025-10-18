#!/usr/bin/env bash

docker run --rm -p 8080:8080 -e KC_BOOTSTRAP_ADMIN_USERNAME=admin -e KC_BOOTSTRAP_ADMIN_PASSWORD=admin -v ./test-realm-realm.json:/opt/keycloak/data/import/test-realm-realm.json quay.io/keycloak/keycloak:26.4.0 start-dev --import-realm
