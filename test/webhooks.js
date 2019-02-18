// var should = require('chai').should()
var should = require('should');

var k2, webhooks;

var TEST_ACCOUNT = {
    clientId: "1",
    clientSecret: "10af7ad062a21d9c841877f87b7dec3dbe51aeb3"
}


describe('Webhooks', function () {

    this.timeout(5000);

    before(function () {
        k2 = require('../lib')(TEST_ACCOUNT);
        webhooks = k2.Webhooks;
    });

    describe('validation', function () {
        var opts = {}
        it('#subscribe() cannot be empty', function () {
            return webhooks.subscribe(opts)
                .should.be.rejected();
        });

        it('#subscribe() must have token details', function(){
            opts.event_type = 'buy_goods_received';
            opts.url = null;
            opts.webhook_secret = "webhook_secret";
            opts.token_details = null;

            return webhooks.subscribe(opts).should.be.rejected();
        })
    
    })

    it('#subscribe()', function(done){
        var opts = {}
        opts.event_type = 'buy_goods_received';
        opts.url = 'http://localhost:8000/test';
        opts.webhook_secret = "webhook_secret";
        opts.token_details = {"token_type":"Bearer",
                                "expires_in":3600,
                                "access_token":"hardToGuessKey"};

        webhooks.subscribe(opts)
                .then(function (subscriptions){
                    subscriptions.should.have.property('resourceId');
                    done();
                })
                .catch(function (error) {
                    console.error(error);
                    done();
                });
    })
})