Ext.define('Account.SaleCreditNote.Item.Form', {
	extend	: 'Ext.form.Panel',
	constructor:function(config) {

		Ext.apply(this, {
			url: __site_url+'creditnote/save_cns',
			layout: 'border',
			border: false
		});

		return this.callParent(arguments);
	},
	initComponent : function() {
		var _this=this;
		
		this.invDialog = Ext.create('Account.SInvoice.MainWindow', {
			disableGridDoubleClick: true,
			isApproveOnly: true
		});
		
		// INIT other components ///////////////////////////////////
		this.customerDialog = Ext.create('Account.SCustomer.MainWindow', {
			disableGridDoubleClick: true,
			isApproveOnly: true
		});
		this.currencyDialog = Ext.create('Account.SCurrency.MainWindow');

		this.gridItem = Ext.create('Account.SaleCreditNote.Item.Grid_i',{
			title:'Credit Items',
			height: 320,
			region:'center'
		});
		
		this.gridItemIT = Ext.create('Account.SaleCreditNote.Item.Grid_it',{
			height: 320,
			region:'center'
		});
		
		this.gridGL = Ext.create('Account.SaleCreditNote.Item.Grid_gl',{
			border: true,
			region:'center',
			title: 'GL Posting'
		});
		this.formTotal = Ext.create('Account.Saleorder.Item.Form_t', {
			border: true,
			split: true,
			title:'GR Total',
			region:'south'
		});
		this.formTotalthb = Ext.create('Account.Saleorder.Item.Form_thb', {
			border: true,
			split: true,
			title:'Exchange Rate->THB',
			region:'south'
		});
		this.gridPrice = Ext.create('Account.Quotation.Item.Grid_pc', {
			border: true,
			split: true,
			title:'Item Pricing',
			region:'south'
		});
		// END INIT other components ////////////////////////////////	
		
        this.comboQStatus = Ext.create('Ext.form.ComboBox', {
			readOnly: !UMS.CAN.APPROVE('SN'),
			fieldLabel: 'Credit Note Status',
			name : 'statu',
			labelAlign: 'right',
			width: 240,
			editable: false,
			allowBlank : false,
			triggerAction : 'all',
			//margin: '0 0 0 -17',
			clearFilterOnReset: true,
			emptyText: '-- Select Status --',
			store: new Ext.data.JsonStore({
				proxy: {
					type: 'ajax',
					url: __site_url+'quotation/loads_acombo',
					reader: {
						type: 'json',
						root: 'rows',
						idProperty: 'statu'
					}
				},
				fields: [
					'statu',
					'statx'
				],
				remoteSort: true,
				sorters: 'statu ASC'
			}),
			queryMode: 'remote',
			displayField: 'statx',
			value: '01',
			valueField: 'statu'
		});
/*---ComboBox Tax Type----------------------------*/
		this.comboTax = Ext.create('Ext.form.ComboBox', {			
			fieldLabel: 'Vat Type',
			name: 'taxnr',
			width: 240,
			labelAlign: 'right',
			editable: false,
			allowBlank : false,
			triggerAction : 'all',
			clearFilterOnReset: true,
		    //emptyText: '-- Please select data --',
			store: new Ext.data.JsonStore({
				proxy: {
					type: 'ajax',
					url: __site_url+'quotation/loads_taxcombo',  //loads_tycombo($tb,$pk,$like)
					reader: {
						type: 'json',
						root: 'rows',
						idProperty: 'taxnr'
					}
				},
				fields: [
					'taxnr',
					'taxtx'
				],
				remoteSort: true,
				sorters: 'taxnr ASC'
			}),
			queryMode: 'remote',
			displayField: 'taxtx',
			value: '01',
			valueField: 'taxnr'
		});	
/*---ComboBox Payment type----------------------------*/
		this.comboPay = Ext.create('Ext.form.ComboBox', {
			fieldLabel: 'Payments',
			name : 'ptype',
			width: 280,
			editable: false,
			//allowBlank : false,
			triggerAction : 'all',
			clearFilterOnReset: true,
			//emptyText: '-- Please Select Payments --',
			store: new Ext.data.JsonStore({
				proxy: {
					type: 'ajax',
					url: __site_url+'quotation/loads_tcombo',
					reader: {
						type: 'json',
						root: 'rows',
						idProperty: 'ptype'
					}
				},
				fields: [
					'ptype',
					'paytx'
				],
				remoteSort: true,
				sorters: 'ptype ASC'
			}),
			queryMode: 'remote',
			displayField: 'paytx',
			valueField: 'ptype'
		});
/*-------------------------------*/			
		this.hdnCnItem = Ext.create('Ext.form.Hidden', {
			name: 'vbcp'
		});
		
		this.hdnGlItem = Ext.create('Ext.form.Hidden', {
			name: 'bcus',
		});

        this.trigInv = Ext.create('Ext.form.field.Trigger', {
			name: 'invnr',
			fieldLabel: 'Invoice No',
			labelAlign: 'letf',
			triggerCls: 'x-form-search-trigger',
			enableKeyEvents: true,
			allowBlank : false
		});
		
		this.trigCustomer = Ext.create('Ext.form.field.Trigger', {
			name: 'kunnr',
			fieldLabel: 'Customer Code',
			triggerCls: 'x-form-search-trigger',
			enableKeyEvents: true,
			allowBlank : false
		});
		
	    this.numberCredit = Ext.create('Ext.ux.form.NumericField', {
            //xtype: 'numberfield',
			fieldLabel: 'Credit Terms',
			name: 'terms',
			labelAlign: 'right',
			width:170,
			hideTrigger:false,
			align: 'right'
         });
         
         this.trigCurrency = Ext.create('Ext.form.field.Trigger', {
			name: 'ctype',
			fieldLabel: 'Currency',
			triggerCls: 'x-form-search-trigger',
			enableKeyEvents: true,
			width: 240,
			labelAlign: 'right',
			allowBlank : false
		});

         this.numberVat = Ext.create('Ext.ux.form.NumericField', {
           // xtype: 'numberfield',
			fieldLabel: 'Vat Value',
			name: 'taxpr',
			labelAlign: 'right',
			width:170,
			align: 'right'//,
			//margin: '0 0 0 35'
         });
         
        this.whtDialog = Ext.create('Account.WHT.Window');
        this.trigWHT = Ext.create('Ext.form.field.Trigger', {
       	    fieldLabel: 'WHT Value',
			name: 'whtnr',
			labelAlign: 'right',
			width:150,
			triggerCls: 'x-form-search-trigger',
			enableKeyEvents: true,
			value: '10'
		});
		
		this.numberWHT = Ext.create('Ext.form.field.Number', {
			name: 'whtpr',
			width:30,
			align: 'right',
			hideTrigger:true,
			margin: '0 0 0 8'
         });
		
		var mainFormPanel = {
			xtype: 'panel',
			border: true,
			region:'north',
			bodyPadding: '5 10 0 10',
			fieldDefaults: {
				labelAlign: 'left',
				msgTarget: 'qtip',
				labelWidth: 105
			},
			items: [this.hdnCnItem, this.hdnGlItem,
			{
				xtype:'fieldset',
				title: 'Heading Data',
				collapsible: true,
				items:[{
		    // Project Code
	 				xtype: 'container',
					layout: 'hbox',
					margin: '0 0 5 0',
		 			items :[{
						xtype: 'hidden',
						name: 'loekz'
					},{
						xtype: 'hidden',
						name: 'id'
					},{
			            xtype: 'hidden',
			            name: 'whtgp'
		              },this.trigInv,
		             {
						xtype: 'displayfield',
						//name: 'name1',
						//margins: '0 0 0 6',
						width:290,
						allowBlank: true
					},{
						xtype: 'displayfield',
					    fieldLabel: 'Credit Note No',
					    name: 'crenr',
						value: 'CNXXXX-XXXX',
						labelAlign: 'right',
						width:240,
						readOnly: true,
						labelStyle: 'font-weight:bold'
					}]
				// Address Bill&Ship
	            },{
	 				xtype: 'container',
					layout: 'hbox',
					margin: '0 0 5 0',
            		items:[{
		                xtype: 'container',
		                flex: 0,
		                layout: 'anchor',
		                
		                items :[{
			 				xtype: 'container',
							layout: 'hbox',
							margin: '0 0 5 0',
				 			items :[this.trigCustomer,{
								xtype: 'displayfield',
								name: 'name1',
								margins: '0 0 0 6',
								width:160,
								allowBlank: true 
			                }]
						}, {
							xtype: 'textarea',
							fieldLabel: 'Customer Address',
							name: 'adr01',
							width: 450, 
							rows:3,
		                }, {xtype: 'container',
							layout: 'hbox',
							margin: '0 0 5 0',
				 			items :[this.comboPay,this.numberVat,{
			       xtype: 'displayfield',
			       align: 'right',
			       width:15,
			       margin: '0 0 0 5',
			       value: '%'
		           }]
				 			},{
			 				xtype: 'container',
							layout: 'hbox',
							margin: '0 0 5 0',
				 			items :[{
								xtype: 'textfield',
								fieldLabel: 'Reference No',
								width: 280, 
								name: 'refnr',
			                },{
			 	xtype: 'container',
				layout: 'hbox',
				margin: '0 0 5 0',
				items: [
				this.trigWHT,this.numberWHT,{
			       xtype: 'displayfield',
			       align: 'right',
			       width:15,
			       margin: '0 0 0 5',
			       value: '%'
		           }]
				}]
		                }]
		            },{
		                xtype: 'container',
		                flex: 0,
		                layout: 'anchor',
		            	margin: '0 0 0 70',
		                items: [this.comboPtype,{
		                //}, {
							xtype: 'datefield',
							fieldLabel: 'Doc Date',
							name: 'bldat',
							labelAlign: 'right',
							width:240,
							format:'d/m/Y',
							altFormats:'Y-m-d|d/m/Y',
							submitFormat:'Y-m-d',
		                }, this.comboTax,
                		this.trigCurrency,
                		{
			xtype: 'container',
                    layout: 'hbox',
                    defaultType: 'textfield',
                    margin: '0 0 5 0',
   items: [this.numberCredit,{
			xtype: 'displayfield',
			margin: '0 0 0 5',
			width:25,
			value: 'Days'
		}]
         },
						{
			xtype: 'datefield',
			fieldLabel: 'Due Date',
			name: 'duedt',
			labelAlign: 'right',
			width:240,
			format:'d/m/Y',
			altFormats:'Y-m-d|d/m/Y',
			submitFormat:'Y-m-d'
		},
		this.comboQStatus]
		            }]
				}]

			}]
		};
		
		this.items = [mainFormPanel,{
			xtype:'tabpanel',
			region:'center',
			activeTab: 0,
			border: false,
			items: [this.gridItem,
			{
				xtype: 'panel',
				border: false,
				title: 'Invoice Items',
				layout: 'border',
				items:[
					this.gridItemIT
				]
			  }]
			},{
			xtype:'tabpanel',
			region:'south',
			activeTab: 0,
			height:220,
			items: [
				this.formTotal,
				this.formTotalthb,
				this.gridPrice,
				this.gridGL
			]
		}
		];	
        
        // event trigPO///
		this.trigInv.on('keyup',function(o, e){
			var v = o.getValue();
			if(Ext.isEmpty(v)) return;

			if(e.getKey()==e.ENTER){
				Ext.Ajax.request({
					url: __site_url+'invoice/load',
					method: 'POST',
					params: {
						id: v
					},
					success: function(response){
						var r = Ext.decode(response.responseText);
						if(r && r.success){
							o.setValue(r.data.invnr);
							_this.getForm().findField('kunnr').setValue(r.data.kunnr);
							_this.getForm().findField('name1').setValue(r.data.name1);			
						    _this.getForm().findField('terms').setValue(r.data.terms);
			                _this.getForm().findField('ptype').setValue(r.data.ptype);
			                _this.getForm().findField('taxnr').setValue(r.data.taxnr);
			                _this.getForm().findField('taxpr').setValue(r.data.taxpr);
			                _this.getForm().findField('ctype').setValue(r.data.ctype);
			                _this.getForm().findField('adr01').setValue(r.data.adr01);
			                _this.getForm().findField('loekz').setValue(r.data.loekz);
			                //_this.getForm().findField('deamt').setValue(r.data.deamt);
						}else{
							o.markInvalid('Could not find Purchase no : '+o.getValue());
						}
					}
				});
			}
		}, this);
		
		_this.invDialog.grid.on('beforeitemdblclick', function(grid, record, item){
			_this.trigInv.setValue(record.data.invnr);
			_this.getForm().findField('kunnr').setValue(record.data.kunnr);
			_this.getForm().findField('name1').setValue(record.data.name1);
			
			var v = record.data.invnr;
			if(Ext.isEmpty(v)) return;
				Ext.Ajax.request({
					url: __site_url+'invoice/load',
					method: 'POST',
					params: {
						id: v
					},
					success: function(response){
						var r = Ext.decode(response.responseText);
						if(r && r.success){
							_this.getForm().findField('adr01').setValue(r.data.adr01);
						    _this.getForm().findField('terms').setValue(r.data.terms);
			                _this.getForm().findField('ptype').setValue(r.data.ptype);
			                _this.getForm().findField('taxnr').setValue(r.data.taxnr);
			                _this.getForm().findField('taxpr').setValue(r.data.taxpr);
			                _this.getForm().findField('ctype').setValue(r.data.ctype);
			                _this.getForm().findField('loekz').setValue(r.data.loekz);
			                //_this.getForm().findField('deamt').setValue(r.data.deamt);
						}
					}
				});
			 
			grid.getSelectionModel().deselectAll();
			//---Load PRitem to POitem Grid-----------
			var grdinvnr = _this.trigInv.value;
			//alert(grdpurnr);
			_this.gridItemIT.load({invnr: grdinvnr });
			//----------------------------------------
			_this.invDialog.hide();
		});
		
		this.trigInv.onTriggerClick = function(){
			_this.invDialog.show();
		};
		
		// event trigVendor///
		this.trigCustomer.on('keyup',function(o, e){
			var v = o.getValue();
			if(Ext.isEmpty(v)) return;

			if(e.getKey()==e.ENTER){
				Ext.Ajax.request({
					url: __site_url+'customer/load2',
					method: 'POST',
					params: {
						id: v
					},
					success: function(response){
						var r = Ext.decode(response.responseText);
						if(r && r.success){
							o.setValue(r.data.kunnr);
							_this.getForm().findField('name1').setValue(r.data.name1);
							_this.getForm().findField('adr01').setValue(r.data.adr01);
							_this.getForm().findField('terms').setValue(r.data.terms);
			                _this.getForm().findField('ptype').setValue(r.data.ptype);
			                _this.getForm().findField('taxnr').setValue(r.data.taxnr);
						}else{
							o.markInvalid('Could not find customer code : '+o.getValue());
						}
					}
				});
			}
		}, this);

		_this.customerDialog.grid.on('beforeitemdblclick', function(grid, record, item){
			_this.trigCustomer.setValue(record.data.kunnr);
			_this.getForm().findField('name1').setValue(record.data.name1);
			
			var v = record.data.kunnr;
			if(Ext.isEmpty(v)) return;
				Ext.Ajax.request({
					url: __site_url+'customer/load2',
					method: 'POST',
					params: {
						id: v
					},
					success: function(response){
						var r = Ext.decode(response.responseText);
						if(r && r.success){
							_this.getForm().findField('adr01').setValue(r.data.adr01);
						    _this.getForm().findField('terms').setValue(r.data.terms);
			                _this.getForm().findField('ptype').setValue(r.data.ptype);
			                _this.getForm().findField('taxnr').setValue(r.data.taxnr);
						}
					}
				});

			grid.getSelectionModel().deselectAll();
			_this.customerDialog.hide();
		});

		this.trigCustomer.onTriggerClick = function(){
			_this.customerDialog.show();
		};
		
		// event trigProject///
		this.trigCurrency.on('keyup',function(o, e){
			var v = o.getValue();
			if(Ext.isEmpty(v)) return;

			if(e.getKey()==e.ENTER){
				Ext.Ajax.request({
					url: __site_url+'currency/load',
					method: 'POST',
					params: {
						id: v
					},
					success: function(response){
						var r = Ext.decode(response.responseText);
						if(r && r.success){
							o.setValue(r.data.ctype);
							_this.formTotal.getForm().findField('curr').setValue(r.data.ctype);
							var store = _this.gridItem.store;
		                    store.each(function(rc){
			                //price = parseFloat(rc.data['unitp']),
			                rc.set('ctype', r.data.ctype);
		                    });
		                    _this.gridItem.curValue = r.data.ctype;
						}else{
							o.markInvalid('Could not find currency code : '+o.getValue());
						}
					}
				});
			}
		}, this);

		_this.currencyDialog.grid.on('beforeitemdblclick', function(grid, record, item){
			_this.trigCurrency.setValue(record.data.ctype);

            _this.formTotal.getForm().findField('curr1').setValue(record.data.ctype);
            var store = _this.gridItem.store;
		    store.each(function(rc){
			//price = parseFloat(rc.data['unitp']),
			rc.set('ctyp1', record.data.ctype);
		    });
		    _this.gridItem.curValue = record.data.ctype;
			grid.getSelectionModel().deselectAll();
			_this.currencyDialog.hide();
		});

		this.trigCurrency.onTriggerClick = function(){
			_this.currencyDialog.show();
		};
		
		// event trigWHT///
		this.trigWHT.on('keyup',function(o, e){
			var v = o.getValue();
			if(Ext.isEmpty(v)) return;

			if(e.getKey()==e.ENTER){
				Ext.Ajax.request({
					url: __site_url+'invoice/loads_wht',
					method: 'POST',
					params: {
						id: v
					},
					success: function(response){
						var r = Ext.decode(response.responseText);
						if(r && r.success){
							o.setValue(r.data.whtnr);
							//_this.formTotal.getForm().findField('curr').setValue(r.data.ctype);
							//if(r.data.whtnr != '6'){
							_this.getForm().findField('whtpr').setValue(r.data.whtpr);
							_this.getForm().findField('whtgp').setValue(r.data.whtgp);
						   //}
						}else{
							o.markInvalid('Could not find wht code : '+o.getValue());
						}
					}
				});
			}
		}, this);

		_this.whtDialog.grid.on('beforeitemdblclick', function(grid, record, item){
			_this.trigWHT.setValue(record.data.whtnr);
			//if(record.data.whtnr != '6'){
            _this.getForm().findField('whtpr').setValue(record.data.whtpr);
            _this.getForm().findField('whtgp').setValue(record.data.whtgp);
           //}
            
			grid.getSelectionModel().deselectAll();
			_this.whtDialog.hide();
		});

		this.trigWHT.onTriggerClick = function(){
			_this.whtDialog.show();
		};
		
//---------------------------------------------------------------------
		// grid event
		this.gridItem.store.on('update', this.calculateTotal, this);
		this.gridItem.store.on('load', this.calculateTotal, this);
		this.on('afterLoad', this.calculateTotal, this);
		this.gridItem.getSelectionModel().on('selectionchange', this.onSelectChange, this);
		this.gridItem.getSelectionModel().on('viewready', this.onViewReady, this);
       
        this.numberCredit.on('keyup', this.getDuedate, this);
        this.numberCredit.on('change', this.getDuedate, this);
		this.comboTax.on('change', this.calculateTotal, this);
		this.trigCurrency.on('change', this.changeCurrency, this);
		this.formTotal.txtRate.on('keyup', this.calculateTotal, this);
		this.formTotal.txtRate.on('change', this.calculateTotal, this);
		this.numberWHT.on('change', this.calculateTotal, this);
        this.numberVat.on('change', this.calculateTotal, this);
		return this.callParent(arguments);
	},
	
	onSelectChange: function(selModel, selections){
		var _this=this;
		var sel = this.gridItem.getView().getSelectionModel().getSelection()[0];
        //var id = sel.data[sel.idField.name];
        if (sel) {
            _this.gridPrice.load({
            	menge:sel.get('menge').replace(/[^0-9.]/g, ''),
            	unitp:sel.get('unitp').replace(/[^0-9.]/g, ''),
            	disit:sel.get('disit').replace(/[^0-9.]/g, ''),
            	vvat:this.numberVat.getValue(),
            	vwht:this.numberWHT.getValue(),
            	vat:sel.get('chk01'),
            	wht:sel.get('chk02'),
            	vattype:this.comboTax.getValue()
            });

        }
    },

    onViewReady: function(grid) {
        grid.getSelectionModel().select(0);
    },
    
	load : function(id){
		var _this=this;
		this.getForm().load({
			params: { id: id },
			url:__site_url+'creditnote/load',
			success: function(form, act){
				_this.fireEvent('afterLoad', form, act);
			}
		});
	},
	save : function(){
		var _this=this;
		var _form_basic = this.getForm();

		// add grid data to json
		var rsItem = this.gridItem.getData();
		this.hdnCnItem.setValue(Ext.encode(rsItem));
		
		var rsGL = _this.gridGL.getData();
		this.hdnGlItem.setValue(Ext.encode(rsGL));

		if (_form_basic.isValid()) {
			_form_basic.submit({
				success: function(form_basic, action) {
					form_basic.reset();
					_this.fireEvent('afterSave', _this, action);
				},
				failure: function(form_basic, action) {
					Ext.Msg.alert('Failed', action.result ? action.result.message : 'No response');
				}
			});
		}
	},
	remove : function(mbeln){
		var _this=this;
		this.getForm().load({
			params: { id: id },
			url:__site_url+'creditnote/remove',
			success: function(res){
				_this.fireEvent('afterDelete', _this);
			}
		});
	},
	reset: function(){
		this.getForm().reset();
		// สั่ง grid load เพื่อเคลียร์ค่า
		this.gridItem.load({ crenr: 0 });
		this.gridItemIT.load({ invnr: 0 });
		this.gridGL.load({
            	netpr:0
            }); 
		
		// สร้างรายการเปล่า 5 รายการใน grid item
		//this.gridItem.addDefaultRecord();

		// default status = wait for approve
		this.comboQStatus.setValue('01');
		this.comboTax.setValue('01');
		this.trigCurrency.setValue('THB');
		this.numberVat.setValue(7);
		this.numberWHT.setValue(3);
		this.getForm().findField('bldat').setValue(new Date());
		this.formTotal.getForm().findField('exchg').setValue('1.0000');
		this.formTotalthb.getForm().findField('exchg2').setValue('1.0000');
		this.formTotal.getForm().findField('bbb').setValue('0.00');
		this.formTotal.getForm().findField('netwr').setValue('0.00');
	},
	// calculate total functions
	calculateTotal: function(){
		var _this=this;
		var store = this.gridItem.store; var sum2=0;
		var sum = 0;var vats=0; var whts=0;var discounts=0;
		var saknr_list = [];
		var vattype = this.comboTax.getValue();
		var currency = this.trigCurrency.getValue();
		var rate = this.formTotal.getForm().findField('exchg').getValue();
		store.each(function(r){
			var qty = parseFloat(r.data['menge']),
				price = parseFloat(r.data['unitp']),
				discount = parseFloat(r.data['disit']);
			qty = isNaN(qty)?0:qty;
			price = isNaN(price)?0:price;
			discount = isNaN(discount)?0:discount;

			var amt = qty * price;//) - discount;
			if(vattype =='02'){
				amt = amt * 100;
			    amt = amt / 107;
		    }
			sum += amt;
			discounts += discount;
            
            amt = amt - discount;
            sum2 += amt;
			if(r.data['chk01']==true){
				var vat = _this.numberVat.getValue();
				    vat = (amt * vat) / 100;
				    vats += vat;
			}
			if(r.data['chk02']==true){
				var wht = _this.numberWHT.getValue();
				    wht = (amt * wht) / 100;
				    whts += wht;
			}
			if(currency != 'THB'){
				amt = amt * rate;
			}
			var item = r.data['saknr'] + '|' + amt;
        		saknr_list.push(item);
		});
		this.formTotal.getForm().findField('beamt').setValue(sum);
		this.formTotal.getForm().findField('vat01').setValue(vats);
		this.formTotal.getForm().findField('wht01').setValue(whts);
		this.formTotal.getForm().findField('dismt').setValue(discounts);
		this.formTotal.calculate();
		
		this.gridItem.vattValue = this.comboTax.getValue();
		this.gridItem.vatValue = this.numberVat.getValue();
		this.gridItem.curValue = currency;
		this.formTotal.getForm().findField('curr1').setValue(currency);
		this.formTotalthb.getForm().findField('curr2').setValue(currency);
		this.formTotal.getForm().findField('vat01').setValue(vats);
	  
	  // Set value to Condition Price grid
        var sel = this.gridItem.getView().getSelectionModel().getSelection()[0];
        if (sel) {
        	//_this.gridPrice.store.removeAll();
            _this.gridPrice.load({
            	menge:sel.get('menge').replace(/[^0-9.]/g, ''),
            	unitp:sel.get('unitp').replace(/[^0-9.]/g, ''),
            	disit:sel.get('disit').replace(/[^0-9.]/g, ''),
            	vvat:this.numberVat.getValue(),
            	vwht:this.numberWHT.getValue(),
            	vat:sel.get('chk01'),
            	wht:sel.get('chk02'),
            	vattype:vattype
            });     
        }
        
        //var deamt = this.formTotal.getForm().findField('deamt').getValue();
        //alert(deamt);
		if(currency != 'THB'){
		  sum = sum * rate;
		  sum2 = sum2 * rate;
		  vats = vats * rate;
		  whts = whts * rate;
		  discounts = discounts * rate;
		  //deamt = deamt * rate;
		}
		this.formTotalthb.getForm().findField('beamt2').setValue(sum);
		this.formTotalthb.getForm().findField('vat02').setValue(vats);
		this.formTotalthb.getForm().findField('wht02').setValue(whts);
		this.formTotalthb.getForm().findField('dismt2').setValue(discounts);
		this.formTotalthb.getForm().findField('exchg2').setValue(rate);
		//this.formTotalthb.getForm().findField('deamt2').setValue(deamt);
		var net2 = this.formTotalthb.calculate();
		 
        if(sum>0 && this.trigCustomer.getValue() != ''){
        	//console.log(rsPM);
            _this.gridGL.load({
            	//paym:Ext.encode(rsPM),
            	netpr:sum2,
            	vvat:vats,
            	kunnr:this.trigCustomer.getValue(),
            	items: saknr_list.join(',')
            	//ptype:'01',
            	//dtype:'01'
            }); 
           }
	},
	
	// Add duedate functions
	getDuedate: function(){
		var bForm = this.getForm(),
			credit = this.numberCredit.getValue(),
			startDate = bForm.findField('bldat').getValue();
		if(!Ext.isEmpty(credit) && credit>0){
			var result = Ext.Date.add(startDate, Ext.Date.DAY, credit),
				dueDateField = bForm.findField('duedt');

			if(!Ext.isEmpty(credit) && !Ext.isEmpty(dueDateField))
				dueDateField.setValue(result);
		}
	},
	
	changeCurrency: function(){
		var _this=this;
		var store = this.gridItem.store;
		var currency = this.trigCurrency.getValue();
		store.each(function(r){
			r.set('ctyp1', currency);
		});
	}
});