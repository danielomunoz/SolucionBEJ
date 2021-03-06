// Importing external and core packages.
const fetch = require('node-fetch');
const { validationResult } = require('express-validator');

// Importing own packages.
const cnsts = require("../config/constants");
const { manageBadRequests, createError, isEmptyArray } = require("../utils/utils");
const { getOwners, getOwnerInfoAndPosts, getPostComments } = require("../services/owner.services");

/**
* @api {get} /api/owners
*
* @apiParam {Number} [page] 
* @apiParam {Number} [limit]
*/
exports.findAll = async (req, res, next) => {

	try{

	// Validate params and manage bad requests (creating a blacklist for the possible hackers).
	const validation_errors = validationResult(req);

    if (!validation_errors.isEmpty()) {
      manageBadRequests(req);
      throw createError(400, 'Bad requests. Params are needed in their correct format', validation_errors.array());
    }

    // Creating pagination values.
    let offset_requests = Number(req.query.page) || cnsts.controllers.owner.MIN_OFFSET_REQUESTS;
    let n_requests = Number(req.query.limit / cnsts.controllers.owner.N_REQUESTS_FACTOR) || cnsts.controllers.owner.MIN_N_REQUESTS;
    let firs_page_to_search = (n_requests*offset_requests - n_requests + cnsts.controllers.owner.ITERATION_ARRAY_FACTOR);
    let last_page_to_search = (n_requests*offset_requests);

    // Creating response object.
    let response = { code: cnsts.http_codes.OK, meta: { pagination: { total: 0, pages: 0, page: Number(req.query.page), limit: Number(req.query.limit)} }, data: [] };

    let owners_info;

    // Doing some recurring requests filling our owners_info object, because the pagination of the external
    // api of users and our own don't match.
    for(let page = firs_page_to_search; page <= last_page_to_search; page++){
        owners_info = await getOwners(page);
        
        if(!isEmptyArray(owners_info.data)) response.data.push(owners_info.data);

        // Below, I ask for the last operation of the loop to finally calculate the total owners and the pages of the response object
        if(page == last_page_to_search){
            response.meta.pagination.total = owners_info.meta.pagination.total;
            response.meta.pagination.pages = Math.floor(owners_info.meta.pagination.pages/n_requests);
        }
    }

    // Send complete response, according to our own pagination.
    res.status(200).json(response);

	} catch(err) { next(err); }

}

/**
* @api {get} /api/owners/:id
*
* @apiParam {Number} [id] id Owner unique ID.
*/
exports.findOwnerAndPosts = async (req, res, next) => {

    try{

        // Validate params and manage bad requests (creating a blacklist for the possible hackers).
        const validation_errors = validationResult(req);

        if (!validation_errors.isEmpty()) {
          manageBadRequests(req);
          throw createError(400, 'Bad requests. Params are needed in their correct format', validation_errors.array());
        }

        let ownerId = req.params.id;

        // Extract info and posts of the owner by calling our own service.
        let query_owner_info_and_posts = await getOwnerInfoAndPosts(ownerId);

        if(query_owner_info_and_posts[0].code != cnsts.http_codes.OK || query_owner_info_and_posts[1].code != cnsts.http_codes.OK){
            throw createError(404, 'There are not results on our database for the owner that you are looking for');
        }

        // Pulling apart owner info and owner posts in order to construct our response object with the demanded format.
        let owner_info, owner_posts;
        [owner_info, owner_posts] = [query_owner_info_and_posts[0].data, query_owner_info_and_posts[1].data];

        // Constructing our response object.
        let response = {};
        response.code = String(cnsts.http_codes.OK);
        response.data = owner_info;

        // Iterating between the owner posts in order to fetch their comments and include them to the response too.
        for(let i=0; i<owner_posts.length; i++){

            // Project documentation does not contemplate 'created_at' and 'updated_at' fields on response, so I delete them
            delete owner_posts[i]["created_at"];
            delete owner_posts[i]["updated_at"];

            let fetch_response = await getPostComments(owner_posts[i].id);
            owner_posts[i]['comments'] = fetch_response.data;

        }

        // Completing the response object and sending it to the user.
        response.data.posts = owner_posts;

        res.status(200).json(response);

    } catch(err) { next(err); }
    
}