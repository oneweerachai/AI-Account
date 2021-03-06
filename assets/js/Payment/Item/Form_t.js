Ext.define('Account.Payment.Item.Form_t', {
	extend	: 'Ext.form.Panel',
	constructor:function(config) {

		Ext.apply(this, {
			url: __site_url+'billfrom/save',
			border: false,
			bodyPadding: 10,
			fieldDefaults: {
				labelAlign: 'left',
				msgTarget: 'qtip'
			}
		});

		return this.callParent(arguments);
	},
	initComponent : function() {
		var _this=this;

		this.txtTotal = Ext.create('Ext.ux.form.NumericField', {
			fieldLabel: 'Total',
			name: 'beamt',
			xtype: 'textfield',
		    fieldLabel: 'Total',
			name: 'beamt',
			alwaysDisplayDecimals: true,
			labelWidth: 155,
			width:270,
			readOnly: true
		});
		/*this.txtDiscount = Ext.create('Ext.form.field.Text', {
			fieldLabel: 'Discount',
			disabled: true,
			name: 'dispc',
			align: 'right',
			labelWidth: 80,
			width:150,
			enableKeyEvents: true,
			validator: function(v){
				if(!Ext.isEmpty(v)){
					var regEx = /^([0-9]*)(\.[1-9]*)?$|^([0-9]|[1-9][0-9]|100)(\.[1-9]*)?(%)$/gi;
					if(regEx.test(v))
						return true;
					else
						return 'Value can be only numbers or percent';
				}else
					return true;
			}
		});*/
		this.txtDiscountValue = Ext.create('Ext.ux.form.NumericField', {
			xtype: 'textfield',
			fieldLabel: 'Discount',
			name: 'dismt',
			align: 'right',
			labelWidth: 155,
			width:270,
			alwaysDisplayDecimals: true,
			readOnly: true
         });
		this.txtDiscountSum = Ext.create('Ext.form.field.Text', {
			fieldLabel: 'After Discount',
			name: 'bbb',
			align: 'right',
			width:270,
			labelWidth: 155,
			margin: '4 0 0 0',
			readOnly: true
		});
		this.txtTaxValue = Ext.create('Ext.ux.form.NumericField', {
            xtype: 'textfield',
            fieldLabel: 'Vat Total',
			align: 'right',
			alwaysDisplayDecimals: true,
			width:270,
			labelWidth: 155,
			name: 'vat01',
			align: 'right',
			margin: '4 0 0 0',
			readOnly: true

         });
        this.txtWHTValue = Ext.create('Ext.ux.form.NumericField', {
            xtype: 'textfield',
            fieldLabel: 'WHT Total',
			align: 'right',
			alwaysDisplayDecimals: true,
			width:270,
			labelWidth: 155,
			name: 'wht01',
			align: 'right',
			margin: '4 0 0 0',
			readOnly: true
         });

		this.txtNet = Ext.create('Ext.ux.form.NumericField', {
         	xtype: 'textfield',
			fieldLabel: 'Net Amount',
			name: 'netwr',
			align: 'right',
			width:270,
			labelWidth: 155,
			alwaysDisplayDecimals: true,
			margin: '4 0 0 0',
			style: 'font-weight:bold',
			labelStyle: 'font-weight:bold',
			readOnly: true
		});

// Start Write Forms
		this.items = [{
			xtype: 'container',
            layout: 'hbox',
            defaultType: 'textfield',
            //margin: '5 0 5 600',
        items: [{
                xtype: 'container',
                layout: 'anchor',
     items :[{
			xtype: 'container',
            layout: 'hbox',
            //margin: '5 0 5 600',
        items: [{
            xtype: 'displayfield',
			//fieldLabel: 'Exchange Rate',
			//name: 'exchg',
			//labelAlign: 'right',
			width:240,
			align: 'right',
			//margin: '0 0 0 -35'
         },{
   	        xtype: 'displayfield',
			align: 'right',
			margin: '0 0 0 5',
			width:60,
			//value: 'THB/USD'
		}]
		},{
   	        xtype: 'textfield',
   	        fieldLabel: 'Rejected Reason',
			align: 'right',
			margin: '3 0 0 0',
			width:380,
			name: 'reanr1'
		},{
			xtype: 'textarea',
			fieldLabel: 'Text Note',
			//labelAlign: 'right',
			margin: '3 0 0 0',
			rows:2,
			width:380,
			name: 'txz01'//,
			//anchor:'90%'
		}]
            },{
                xtype: 'container',
                layout: 'anchor',
                margins: '0 0 0 280',
        items: [this.txtTotal,{
			xtype: 'container',
            layout: 'hbox',
			items: [this.txtDiscountValue]
		},this.txtDiscountSum,this.txtTaxValue,this.txtWHTValue,
	this.txtNet]
		}]
		}];
		
		// Event /////////
		var setAlignRight = function(o){
			o.inputEl.setStyle('text-align', 'right');
		};
		var setBold = function(o){
			o.inputEl.setStyle('font-weight', 'bold');
		};
		this.txtTotal.on('render', setAlignRight);
		this.txtDiscountValue.on('render', setAlignRight);
		this.txtDiscountSum.on('render', setAlignRight);
		this.txtWHTValue.on('render', setAlignRight);
		this.txtTaxValue.on('render', setAlignRight);
		this.txtNet.on('render', setAlignRight);
		this.txtNet.on('render', setBold);

		//this.txtDiscount.on('keyup', this.calculate, this);
		//this.txtTax.on('keyup', this.calculate, this);

		return this.callParent(arguments);
	},
	load : function(id){
		this.getForm().load({
			params: { id: id },
			url:__site_url+'billto/load'
		});
	},
	save : function(){
		var _this=this;
		var _form_basic = this.getForm();
		if (_form_basic.isValid()) {
			_form_basic.submit({
				success: function(form_basic, action) {
					form_basic.reset();
					_this.fireEvent('afterSave', _this);
				},
				failure: function(form_basic, action) {
					Ext.Msg.alert('Failed', action.result ? action.result.message : 'No response');
				}
			});
		}
	},
	remove : function(id){
		var _this=this;
		this.getForm().load({
			params: { id: id },
			url:__site_url+'billto/remove',
			success: function(res){
				_this.fireEvent('afterDelete', _this);
			}
		});
	},
	// calculate function
	calculate: function(){
		var total = this.txtTotal.getValue();
			total = parseFloat(total),
			total = isNaN(total)?0:total;

		//console.log(total);

		if(total<=0) return;

		var discount = this.txtDiscountValue.getValue();
		discount = parseFloat(discount),
		discount = isNaN(discount)?0:discount;
		this.txtDiscountSum.setValue(Ext.util.Format.usMoney(total - discount).replace(/\$/, ''));
		var vat01 = this.txtTaxValue.getValue();
		vat01 = parseFloat(vat01),
		vat01 = isNaN(vat01)?0:vat01;
		var wht01 = this.txtWHTValue.getValue();
		wht01 = parseFloat(wht01),
		wht01 = isNaN(wht01)?0:wht01;
		/*	discountValue = 0;
		if(this.txtDiscount.isValid() && !Ext.isEmpty(discount)){
			if(discount.match(/%$/gi)){
				discount = discount.replace('%','');
				var discountPercent = parseFloat(discount);
				discountValue = total * discountPercent / 100;
			}else{
				discountValue = parseFloat(discount);

			}
			discountValue = isNaN(discountValue)?0:discountValue;

			this.txtDiscountValue.setValue(Ext.util.Format.usMoney(discountValue).replace(/\$/, ''));

			if(discountValue>0)
				this.txtDiscountSum.setValue(Ext.util.Format.usMoney(total - discountValue).replace(/\$/, ''));
		}else{
			this.txtDiscountValue.setValue('0.00');
			this.txtDiscount.setValue('');
			this.txtDiscountSum.setValue(Ext.util.Format.usMoney(total).replace(/\$/, ''));
		}

		*/
		
		total = total - discount;
		this.txtDiscountSum.setValue(Ext.util.Format.usMoney(total).replace(/\$/, ''));

		var net = total - wht01;
		net = net + vat01;
		this.txtNet.setValue(net);
		
		return net;
	}
});