# API Client Library

This API Client Library is designed to simplify interactions with RESTful APIs by abstracting the complexities of HTTP requests and token management. It leverages Axios for HTTP requests and provides automatic token refresh for APIs that use bearer token authentication.

## Features

- Simplified Axios client setup with base URL and timeout configuration.
- Automatic handling of bearer token authentication.
- Automatic token refresh on receiving a 401 Unauthorized response, using a provided refresh token.

## Installation

To use this library, first ensure you have Axios installed in your project. If not, you can add it by running:

```bash
npm install
