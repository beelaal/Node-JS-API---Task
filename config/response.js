/**
 * Created by Bilal on 7/5/2017.
 */

'use strict'; //NOSONAR

let successResponse = (res, data) => {
    data.response = 200;
    res.json(data);
}

let errorResponse = (res, err) => {

    res.json({
        success: 0,
        data: {},
        error : err
    });

}


module.exports = {
    successResponse,
    errorResponse
}
