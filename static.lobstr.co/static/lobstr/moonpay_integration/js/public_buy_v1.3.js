"use strict";(function($){window.onpageshow=function(event){if(event.persisted){window.location.reload()}};$(function(){var $form=$('.buy-xlm-form'),$submitButton=$form.find("[type='submit']"),$confirmationPopup=$('#buy-xlm-confirmation-modal'),exchangeRates=null,params=new URLSearchParams(window.location.search),targetAddress=params.get('target_address')||null
$form.find('[name="target_address"]').val(targetAddress);var updateBuyText=function(){var formData=getFormData($form);var currency=$form.find('[name="currency_code"]').select2('data');if(currency){currency=currency[0];document.title=gettext("Buy ")+(currency.name||currency.code.toUpperCase())+" | LOBSTR";$form.find('[type="submit"]').find('.active-content, .disable-content').html(gettext("Buy ")+currency.code.toUpperCase());$form.find('[name="currency_amount"]').attr('placeholder',gettext('The amount of {0} you will receive'.format(currency.code)));}};var loadExchangeRates=function(success,error){$submitButton.prop('disabled',true);var formData=getFormData($form);$.ajax({type:'GET',url:'{0}?currency_code={1}'.format($('#moonpay-price-endpoint').attr('data-value'),$form.find('[name="currency_code"]').val().toLowerCase()),success:function(response){$submitButton.prop('disabled',false);if(success){success(response);}},error:function(response){$submitButton.prop('disabled',false);if(error){error(response);}}});};loadExchangeRates(function(response){exchangeRates=response;$form.find('[name="base_currency_amount"]').trigger('input');});var getValidationConfig=function(form){var data=getFormData(form);var currencyOption=$form.find('[name="base_currency_code"]').select2('data')[0];var config={onfocusout:false,onkeyup:false,onclick:false,rules:{base_currency_amount:{min:parseFloat(currencyOption.min_amount),max:parseFloat(currencyOption.max_amount),},},messages:{base_currency_amount:{"max":jQuery.validator.format(gettext("You can't spend more than {0} ")+currencyOption.code),"min":jQuery.validator.format(gettext("You can't spend less than {0} ")+currencyOption.code),}},errorPlacement:function(error,element){element.parent().append(error.addClass('error-message').addClass('help-text').addClass('invalid-feedback'));},highlight:function(element,errorClass){$(element).addClass(errorClass);$(element).closest('.form-group').addClass('has-error');},unhighlight:function(element,errorClass){$(element).removeClass(errorClass);$(element).closest('.form-group').removeClass('has-error');},errorClass:"is-invalid invalid",errorElement:"span",};return config;};var formValidator=null;var initializeFormValidator=function(form){var validationRule=getValidationConfig(form);if(formValidator){formValidator.destroy();}
formValidator=form.validate(validationRule);};var updateBaseCurrencyAmount=function(){if(!exchangeRates){return;}
var formData=getFormData($form),currencyCode=$form.find('[name="base_currency_code"]').select2('data')[0].code.toUpperCase();if(formData.base_currency_amount!=""){$form.find('[name="base_currency_amount"]').val((formData.currency_amount*exchangeRates[currencyCode]).toFixed(2));}else{$form.find('[name="base_currency_amount"]').val(0);}};$form.find('[name="currency_amount"]').on('keyup keydown input',$.debounce(500,function(){updateBaseCurrencyAmount();}));var updateCurrencyAmount=function(){if(!exchangeRates){return;}
var formData=getFormData($form),currencyObj=$form.find('[name="base_currency_code"]').select2('data')[0],cryptoCurrencyObj=$form.find('[name="currency_code"]').select2('data')[0],currencyCode=currencyObj.code.toUpperCase();if(formData.base_currency_amount!=0){$form.find('[name="currency_amount"]').val(Math.floor10(formData.base_currency_amount/exchangeRates[currencyCode],-cryptoCurrencyObj.precision));}else{$form.find('[name="currency_amount"]').val(0);}};$form.find('[name="base_currency_amount"]').on('keyup keydown input',$.debounce(500,function(){updateCurrencyAmount();}));$form.find('[name="base_currency_code"]').on('change',updateCurrencyAmount);$form.find('[name="currency_code"]').on('select2:select',function(e){updateBuyText();});$form.find('[name="currency_code"]').on('change',function(){$submitButton.prop('disabled',true);loadExchangeRates(function(response){exchangeRates=response;$submitButton.prop('disabled',false);$form.find('[name="base_currency_amount"]').trigger('input');},function(){$submitButton.prop('disabled',false);});});$form.find('[name="base_currency_code"]').on('change',function(){var currency=$form.find('[name="base_currency_code"]').select2('data')[0],code=currency.code;$(this).closest('form').find('#hint_id_base_currency_amount .help-text-mask').html($(this).closest('form').find('#hint_id_base_currency_amount .help-text-mask').attr('data-mask').format(currency.symbol,currency.min_amount,currency.symbol,currency.max_amount,));initializeFormValidator($form);});$form.find('[name="base_currency_code"]').on('select2Initializated',function(){$(this).trigger('change')});var checkCurrencyQuote=function(success,error){var formData=getFormData($form);$submitButton.prop('disabled',true);$.ajax({type:'GET',url:'{0}?base_currency_code={1}&base_currency_amount={2}&currency_code={3}'.format($('#moonpay-quote-endpoint').attr('data-value'),$form.find('[name="base_currency_code"]').select2('data')[0].code.toLowerCase(),formData.base_currency_amount,$form.find('[name="currency_code"]').select2('data')[0].code.toLowerCase()),success:function(response){$submitButton.prop('disabled',false);if(success){success(response);}},error:function(response){$submitButton.prop('disabled',false);if(error){error(response);}}});};var currencyQuote={};$form.submit(function(event){event.preventDefault();hideErrors($form);var form=$(this);if(!form.valid()){return;}
checkCurrencyQuote(function(response){currencyQuote=response;initializeFormValidator(form);if(!form.valid()){return;}else if(form.valid()&&!$confirmationPopup.is(":visible")){$confirmationPopup.modal('show');return;}
event.currentTarget.submit();$form[0].reset();$confirmationPopup.modal('hide');},function(response){if(response.responseJSON&&response.responseJSON.message){showErrors($form,{'detail':response.responseJSON.message});}else{showErrors($form,{'detail':'Unexpected moonpay response'});}});});$confirmationPopup.on('show.bs.modal',function(){$form.find('[type="submit"]').prop('disabled',true);$confirmationPopup.find('[type="submit"]').prop("disabled",false);var data=getFormData($form),$this=$(this),baseCurrencyCode=$form.find('[name="base_currency_code"]').select2('data')[0].code.toUpperCase();$this.find('.order-details .service-fee .item-value').html("{0} {1}".format(Math.ceil10(currencyQuote.feeAmount+currencyQuote.extraFeeAmount,-2),baseCurrencyCode));$this.find('.order-details .total-charge .item-value').html("{0} {1}".format(currencyQuote.totalAmount,baseCurrencyCode));if(currencyQuote.networkFeeAmount>0){$this.find('.order-details .network-fee').removeClass('hidden')};$this.find('.order-details .network-fee .item-value').html("{0} {1}".format(currencyQuote.networkFeeAmount,baseCurrencyCode));$this.find('.order-details .order-amount .item-value').html("{0} {1}".format(currencyQuote.quoteCurrencyAmount,$form.find('[name="currency_code"]').select2('data')[0].code.toUpperCase()));});$confirmationPopup.find('[type="submit"]').on('click',function(e){e.preventDefault();$confirmationPopup.find('[type="submit"]').prop("disabled",true);$form.submit();});$confirmationPopup.on('hidden.bs.modal',function(){$form.find('[type="submit"]').prop('disabled',false);});var buyCryptoUrl=$('#moonpay-buy-crypto').attr('data-value');if(buyCryptoUrl){window.history.pushState('buy_crypto',gettext('Buy crypto'),$('#moonpay-buy-crypto').attr('data-value'));}});})($);