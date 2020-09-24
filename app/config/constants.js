module.exports = {
	db_config: {
		HOST: "localhost",
  		USER: "root",
  		PASSWORD: "danira10",
  		DB: "pixomaticdma",
  		DIALECT: "mysql"
	},
	sql_dump: {
		MIN_TABLE_ID: 1,
		MAX_TABLE_ID: 221,
		THREE_DIGITS_EXAMPLE_NUMBER: 500
	},
	controllers:
	{
		company: {
			HASH_ALGORITHM: 'sha256',
			DIGEST: 'hex',
			MIN_PAGE: 1,
			OFFSET_PAGINATION_FACTOR: 20,
			DEFAULT_LIMIT: 20
		},
		owner: {
			MIN_OFFSET_REQUESTS: 1,
			MIN_N_REQUESTS: 1,
			N_REQUESTS_FACTOR: 20,
			ITERATION_ARRAY_FACTOR: 1,
			MIN_ARRAY_PROMISES_LENGTH: 2
		},
		shared: {
			API_USERS_BASE_URL: 'https://gorest.co.in/public-api/users',
			AUTH_TOKEN: '81b1e819c22544b53421cddd82548fbc35f64c97674ab3221f2e881a8cc51f6a',
			API_USERS_POSTS_BASE_URL: 'https://gorest.co.in/public-api/posts'
		}
	},
	middlewares: {
		security: {
			company: {
				FIRST_PAGE_NOT_ALLOWED_WITHOUT_TOKEN: 11
			}
		}
	},
	http_codes:{
		OK: 200,
		BAD_REQUEST: 400,
		FORBIDDEN: 403,
		NOT_FOUND: 404,
		INTERNAL_SERVER_ERROR: 500,
		ALREADY_EXISTS: 409
	}
}