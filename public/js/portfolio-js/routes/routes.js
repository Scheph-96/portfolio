function routes(param=null) {
    return {
        home: {
            addressBarUrl: '/',
            pageUrl: '/home',
        },
        order: {
            addressBarUrl: '/order/'+param,
            pageUrl: '/load-order/'+param
        },
        orderSuccess: {
            addressBarUrl: '/order-success',
            // pageUrl: '/load-order-success/order-success'
        },
        // webWork: {
        //     addressBarUrl: '/web-work/'+param,
        //     pageUrl: 
        // }
        default: {
            addressBarUrl: '/notfound',
            pageUrl: '/unknown-route'
        }
    }
}

export {
    routes
}