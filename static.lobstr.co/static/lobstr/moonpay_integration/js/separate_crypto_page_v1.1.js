"use strict";(function($){$(function(){var $form=$('.buy-xlm-form');$form.find('[name="currency_code"]').on('select2:select',function(e){var currencyData=$form.find('[name="currency_code"]').select2('data')[0]
window.location=$('#moonpay-buy-currency-endpoint').attr('data-value').replace('AAA',currencyData.slug_name.toLowerCase());});});})($);