require('should')
const expect = require('chai').expect
const nock = require('nock')

var TEST_ACCOUNT = require('./credentials').TEST_ACCOUNT
const response = require('./response/transfer')

const BASE_URL = 'https://9284bede-3488-4b2b-a1e8-d6e9f8d86aff.mock.pstmn.io'

var k2, transfer

describe('TransferService', function () {
	this.timeout(5000)

	before(function () {
		k2 = require('../lib')(TEST_ACCOUNT)
		transfer = k2.TransferService
	})

	describe('settleFunds()', function () {
		beforeEach(() => {
			nock(BASE_URL)
				.post('/settlement_transfers')
				.reply(201, {}, response.location)
		})

		describe('settleFunds() absence of required values validation', function () {

			it('#settleFunds() has to have a currency', function () {
				var opts = {}
				opts.amount = 200
				opts.destinationType = 'merchant_wallet'
				opts.destinationReference = 'my_destination_reference'
				opts.accessToken = 'hardToGuessKey'
				opts.callbackUrl = 'https://your-call-bak.yourapplication.com/transfer_result'

				return transfer.settleFunds(opts)
					.should.be.rejectedWith(Error, { message: 'Currency can\'t be blank; ' })
			})

			it('#settleFunds() has to have an amount', function () {
				var opts = {}
				opts.currency = 'KES'
				opts.destinationType = 'merchant_wallet'
				opts.destinationReference = 'my_destination_reference'
				opts.accessToken = 'hardToGuessKey'
				opts.callbackUrl = 'https://your-call-bak.yourapplication.com/transfer_result'

				return transfer.settleFunds(opts)
					.should.be.rejectedWith(Error, { message: 'Amount can\'t be blank; ' })
			})

			it('#settleFunds() has to have an accessToken', function () {
				var opts = {}
				opts.currency = 'KES'
				opts.amount = 200
				opts.destinationType = 'merchant_wallet'
				opts.destinationReference = 'my_destination_reference'
				opts.callbackUrl = 'https://your-call-bak.yourapplication.com/transfer_result'

				return transfer.settleFunds(opts)
					.should.be.rejectedWith(Error, { message: 'Access token can\'t be blank; ' })
			})
		})

		describe('settleFunds() data types validation', function () {
			var opts = {}
			it('#settleFunds() currency has to be a string', function () {
				opts.currency = 3
				opts.amount = 200
				opts.destinationType = 'merchant_wallet'
				opts.destinationReference = 'my_destination_reference'
				opts.accessToken = 'hardToGuessKey'
				opts.callbackUrl = 'https://your-call-bak.yourapplication.com/transfer_result'

				return transfer.settleFunds(opts)
					.should.be.rejectedWith(Error, { message: 'Currency must be a string; ' })
			})

			it('#settleFunds() amount has to be an integer', function () {
				opts.currency = 'KES'
				opts.amount = 'Two hundred'
				opts.destinationType = 'merchant_wallet'
				opts.destinationReference = 'my_destination_reference'
				opts.accessToken = 'hardToGuessKey'
				opts.callbackUrl = 'https://your-call-bak.yourapplication.com/transfer_result'

				return transfer.settleFunds(opts)
					.should.be.rejectedWith(Error, { message: 'Amount is not a number; ' })
			})

			it('#settleFunds() destination type has to be a string', function () {
				opts.currency = 'KES'
				opts.amount = 200
				opts.destinationType = 2
				opts.destinationReference = 'my_destination_reference'
				opts.accessToken = 'hardToGuessKey'
				opts.callbackUrl = 'https://your-call-bak.yourapplication.com/transfer_result'

				return transfer.settleFunds(opts)
					.should.be.rejectedWith(Error, { message: 'Destination type must be a string; ' })
			})

			it('#settleFunds() destination reference has to be a string', function () {
				opts.currency = 'KES'
				opts.amount = 200
				opts.destinationType = 'merchant_wallet'
				opts.destinationReference = 2
				opts.accessToken = 'hardToGuessKey'
				opts.callbackUrl = 'https://your-call-bak.yourapplication.com/transfer_result'

				return transfer.settleFunds(opts)
					.should.be.rejectedWith(Error, { message: 'Destination reference must be a string; ' })
			})

			it('#settleFunds() has to have callbackUrl', function () {
				var opts = {}

				opts.destinationType = 'merchant_wallet'
				opts.destinationReference = 'my_destination_reference'
				opts.currency = 'KES'
				opts.amount = 200
				opts.accessToken = 'hardToGuessKey'

				return transfer.settleFunds(opts).should.be.rejectedWith(Error, { message: 'Callback url can\'t be blank; ' })
			})

			it('#settleFunds() callbackUrl has to be a valid url', function () {
				var opts = {}

				opts.destinationType = 'merchant_wallet'
				opts.destinationReference = 'my_destination_reference'
				opts.currency = 'KES'
				opts.amount = 200
				opts.callbackUrl = 'an_invalid_url'
				opts.accessToken= 'hardToGuessKey'

				return transfer.settleFunds(opts).should.be.rejectedWith(Error, { message: 'Callback url is not a valid url; ' })
			})
		})
		it('#settleFunds() succeeds', () => {
			var opts = {}
	
			opts.destinationType = 'merchant_wallet'
			opts.destinationReference = 'my_destination_reference'
			opts.currency = 'KES'
			opts.amount = 200
			opts.accessToken = 'hardToGuessKey'
			opts.callbackUrl = 'https://your-call-bak.yourapplication.com/transfer_result'
	
			return transfer.settleFunds(opts).then(response => {
				expect(response).to.equal('https://sandbox.kopokopo.com/settlement_transfers/d76265cd-0951-e511-80da-0aa34a9b2388')
			})
				
		})
	})

	describe('createMerchantBankAccount()', function () {

		beforeEach(() => {
			nock(BASE_URL)
				.post('/merchant_bank_accounts')
				.reply(201, {}, response.accountLocation)
		})

		describe('createMerchantBankAccount() validation', function () {

			it('#createMerchantBankAccount() has to have a settlementMethod', function () {
				var opts = {}

				opts.accountName = 'my_account_name'
				opts.bankBranchRef = '9ed38155-7d6f-11e3-83c3-5404a6144203'
				opts.accountNumber = '1234567890'
				opts.accessToken = 'hardToGuessKey'

				return transfer.createMerchantBankAccount(opts)
					.should.be.rejectedWith(Error, { message: 'Settlement method can\'t be blank; ' })
			})

			it('#createMerchantBankAccount() has to have an accountName', function () {
				var opts = {}

				opts.accountNumber = '1234567890'
				opts.bankBranchRef = '9ed38155-7d6f-11e3-83c3-5404a6144203'
				opts.settlementMethod = 'RTS'
				opts.accessToken = 'hardToGuessKey'

				return transfer.createMerchantBankAccount(opts)
					.should.be.rejectedWith(Error, { message: 'Account name can\'t be blank; ' })
			})

			it('#createMerchantBankAccount() has to have an accountNumber', function () {
				var opts = {}

				opts.bankBranchRef = '9ed38155-7d6f-11e3-83c3-5404a6144203'
				opts.accountName = 'my_account_name'
				opts.settlementMethod = 'RTS'
				opts.accessToken = 'hardToGuessKey'

				return transfer.createMerchantBankAccount(opts)
					.should.be.rejectedWith(Error, { message: 'Account number can\'t be blank; ' })
			})

			it('#createMerchantBankAccount() has to have an accessToken', function () {
				var opts = {}

				opts.accountName = 'my_account_name'
				opts.bankBranchRef = '9ed38155-7d6f-11e3-83c3-5404a6144203'
				opts.settlementMethod = 'RTS'
				opts.accountNumber = '1234567890'

				return transfer.createMerchantBankAccount(opts)
					.should.be.rejectedWith(Error, { message: 'Access token can\'t be blank; ' })
			})
		})

		it('#createMerchantBankAccount()', () => {
			var opts = {}
	
			opts.accountName = 'my_account_name'
			opts.settlementMethod = 'RTS'
			opts.bankBranchRef = '9ed38155-7d6f-11e3-83c3-5404a6144203'
			opts.accountNumber = '1234567890'
			opts.accessToken = 'hardToGuessKey'
	
	
			return transfer.createMerchantBankAccount(opts).then(response => {
				expect(response).to.equal('https://sandbox.kopokopo.com/merchant_bank_accounts/AB443D36-3757-44C1-A1B4-29727FB3111C')
			})
		})
	})

	describe('createMerchantWallet()', function () {

		beforeEach(() => {
			nock(BASE_URL)
				.post('/merchant_wallets')
				.reply(201, {}, response.walletLocation)
		})

		describe('createMerchantWallet() validation', function () {

			it('#createMerchantWallet() has to have a phoneNumber', function () {
				var opts = {}

				opts.network = '1234567890'
				opts.accessToken = 'hardToGuessKey'

				return transfer.createMerchantWallet(opts)
					.should.be.rejectedWith(Error, { message: 'Phone number can\'t be blank; ' })
			})

			it('#createMerchantWallet() has to have a network', function () {
				var opts = {}

				opts.phoneNumber = 'my_account_name'
				opts.accessToken = 'hardToGuessKey'

				return transfer.createMerchantWallet(opts)
					.should.be.rejectedWith(Error, { message: 'Network can\'t be blank; ' })
			})

			it('#createMerchantWallet() has to have an accessToken', function () {
				var opts = {}

				opts.phoneNumber = 'my_account_name'
				opts.network = '1234567890'

				return transfer.createMerchantWallet(opts)
					.should.be.rejectedWith(Error, { message: 'Access token can\'t be blank; ' })
			})
		})

		it('#createMerchantWallet()', () => {
			var opts = {}
	
			opts.phoneNumber = 'my_account_name'
			opts.network = '1234567890'
			opts.accessToken = 'hardToGuessKey'
	
	
			return transfer.createMerchantWallet(opts).then(response => {
				expect(response).to.equal('https://sandbox.kopokopo.com/merchant_wallets/AB443D36-3757-44C1-A1B4-29727FB3111C')
			})
		})
	})

	describe('settlementStatus()', function () {
		beforeEach(() => {
			nock(BASE_URL)
				.get('/my_transfer_request_location')
				.reply(200, response.status)
		})

		describe('settlementStatus() validation', function () {
			var opts = {}

			it('#settlementStatus() cannot be empty', function () {
				return transfer.settlementStatus(opts).should.be.rejected()
			})

			it('#settlementStatus() has to have location', function () {
				var opts = {}
				opts.accessToken = 'hardToGuessKey'

				return transfer.settlementStatus(opts).should.be.rejectedWith(Error, { message: 'Location can\'t be blank; ' })
			})

			it('#settlementStatus() location has to be a string', function () {
				var opts = {}
				opts.location = 4
				opts.accessToken = 'hardToGuessKey'

				return transfer.settlementStatus(opts).should.be.rejectedWith(Error, { message: 'Location must be a string; ' })
			})

			it('#settlementStatus() has to have accessToken', function () {
				var opts = {}
				opts.location = BASE_URL + '/my_transfer_request_location'

				return transfer.settlementStatus(opts).should.be.rejectedWith(Error, { message: 'Access token can\'t be blank; ' })
			})
		})

		it('#settlementStatus()', () => {
			var opts = {}

			opts.accessToken = 'hardToGuessKey'
			opts.location = BASE_URL + '/my_transfer_request_location'

			return transfer.settlementStatus(opts).then(response => {
				// expect an object back
				expect(typeof response).to.equal('object')
				
				// Test result of status for the response
				expect(response.status).to.equal('Pending')

			})
		})
	})
})
