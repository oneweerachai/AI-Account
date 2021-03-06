Ext.define('Account.Billfrom.Item.Grid_i', {
	extend	: 'Ext.grid.Panel',
	constructor:function(config) {
		return this.callParent(arguments);
	},

	initComponent : function() {
		var _this=this;

		this.addAct = new Ext.Action({
			text: 'Add',
			iconCls: 'b-small-plus'
		});
		this.copyAct = new Ext.Action({
			text: 'Copy',
			iconCls: 'b-small-copy'
		});

		// INIT Invoice search popup /////////////////////////////////
		this.apDialog = Ext.create('Account.SAp.MainWindow', {
			disableGridDoubleClick: true,
			isApproveOnly: true
		});
		// END Invoice search popup //////////////////////////////////

		this.tbar = [this.addAct, this.copyAct];

		this.editing = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit: 1
		});

		this.store = new Ext.data.JsonStore({
			proxy: {
				type: 'ajax',
				url: __site_url+"billfrom/loads_bt_item",
				reader: {
					type: 'json',
					root: 'rows',
					idProperty: 'bilnr,vbelp'
				}
			},
			fields: [
			    'bilnr',
				'vbelp',
				'invnr',
				'refnr',
				'invdt',
				'texts',
				{name:'itamt', type: 'string'},
				//'payrc',
				//'reman',
				'lifnr',
				'ctyp1'
			],
			remoteSort: true,
			sorters: ['vbelp ASC'],
			pageSize: 10000000
		});

		this.columns = [
		    {
			xtype: 'actioncolumn',
			width: 30,
			sortable: false,
			menuDisabled: true,
			items: [{
				icon: __base_url+'assets/images/icons/bin.gif',
				tooltip: 'Delete Receipt Item',
				scope: this,
				handler: this.removeRecord
			}]
		},{
			id : 'RowNumber25',
			header : "No.",
			dataIndex : 'vbelp',
			width : 60,
			align : 'center',
			resizable : false, sortable : false,
			renderer : function(value, metaData, record, rowIndex) {
				return rowIndex+1;
			}
		},
		{text: "Billing Code",
		width: 100,
		dataIndex: 'invnr',
		align : 'center',
		sortable: false,
			field: {
				xtype: 'triggerfield',
				enableKeyEvents: true,
				triggerCls: 'x-form-search-trigger',
				onTriggerClick: function(){
					_this.editing.completeEdit();
					_this.apDialog.show();
				}
			},
			},
			{text: "Billing Date",
		    width: 80,
		    xtype: 'datecolumn',
		    dataIndex: 'invdt',
		    sortable: false,
		    renderer : Ext.util.Format.dateRenderer('m/d/Y')
		    },
		    {text: "Ref.No",
		    width: 150,
		    dataIndex: 'refnr',
		    sortable: false,
		    field: {
				type: 'textfield'
			},
		    },
		    
		    {text: "Text Note",
		    width: 300,
		    dataIndex: 'texts',
		    sortable: false,
		    field: {
				type: 'textfield'
			},
		    },
			{text: "Billing Amt",
			xtype: 'numbercolumn',
			width: 120,
			dataIndex: 'itamt',
			sortable: false,
			align: 'right',
			readOnly: true
			},
			/*{text: "Payment Amt",
			xtype: 'numbercolumn',
			width: 100,
			dataIndex: 'payrc',
			sortable: false,
			align: 'right',
			readOnly: true
			},
			{
				text: "Remain Amt",
				xtype: 'numbercolumn',
				width: 100,
				dataIndex: 'reman',
				sortable: false,
				align: 'right',
				readOnly: true,
				renderer: function(v,p,r){
					var itamt = parseFloat(r.data['itamt']),
						pay = parseFloat(r.data['payrc']);
					itamt = isNaN(itamt)?0:itamt;
					pay = isNaN(pay)?0:pay;

					var amt = itamt - pay;
					return Ext.util.Format.usMoney(amt).replace(/\$/, '');
				}
			},*///{text: "",xtype: 'hidden',width: 0, dataIndex: 'statu'},
			{text: "Currency",
			width: 55,
			dataIndex: 'ctyp1',
			sortable: false,
			align: 'center'
		},
			{
			dataIndex: 'lifnr',
			//width: 55,
			hidden: true,
			sortable: false
		}];

		this.plugins = [this.editing];

		// init event
		this.addAct.setHandler(function(){
			_this.addRecord();
		});
		
		this.copyAct.setHandler(function(){
			_this.copyRecord();
		});

		this.editing.on('edit', function(editor, e) {
			if(e.column.dataIndex=='invnr'){
				var v = e.value;

				if(Ext.isEmpty(v)) return;
				
				var v_url = 'ap/load';
				var v_str = v.substring(0,1);
				if(v_str == 'D'){
					v_url = 'depositout/load';
				}

				Ext.Ajax.request({
					url: __site_url+'ap/load',
					method: 'POST',
					params: {
						id: v,
						key: 1
					},
					success: function(response){
						var r = Ext.decode(response.responseText);
						if(r && r.success){
							var rModel = _this.store.getById(e.record.data.id);
							
							// check data
				var isDuplicate = false;
				_this.store.each(function(record){
					//alert(v.data['invnr']+'/');

				  	if(r.data.invnr == record.data.invnr){
				  		isDuplicate = true;
				  		return false;
				  	}
				});
				if(isDuplicate){
					Ext.Msg.alert('Warning', 'The invoice number already on list.');
					return;
				}

							// change cell code value (use db value)
							rModel.set(e.field, r.data.invnr);
							// Ref no
							rModel.set('refnr', r.data.refnr);
							// Invoice date
							rModel.set('invdt', r.data.bldat);
							// Text Note
							rModel.set('texts', r.data.txz01);
							// Invoice amt
							rModel.set('itamt', r.data.netwr);
							// Currency
							rModel.set('ctyp1', r.data.ctype);
							//rModel.set('amount', 100+Math.random());
							rModel.set('lifnr', r.data.lifnr);

						}else{
							var rModel = _this.store.getById(e.record.data.id);
							rModel.set(e.field, '');
							rModel.set('refnr', '');
							rModel.set('invdt', '');
							rModel.set('texts', '');
							rModel.set('itamt', '');
							rModel.set('ctyp1', '');
							rModel.set('lifnr', '');
							//_this.editing.startEdit(e.record, e.column);
						}
					}
				});
			}
		});

		_this.apDialog.grid.on('beforeitemdblclick', function(grid, record, item){
			var rModels = _this.getView().getSelectionModel().getSelection();
			if(rModels.length>0){
				rModel = rModels[0];
				
				// check data
				var isDuplicate = false;
				_this.store.each(function(r){
					//alert(v.data['invnr']+'/');

				  	if(r.data.invnr == record.data.invnr){
				  		isDuplicate = true;
				  		return false;
				  	}
				});
				if(isDuplicate){
					Ext.Msg.alert('Warning', 'The AP number already on list.');
					return;
				}

				// change cell code value (use db value)
				rModel.set('invnr', record.data.invnr);
				// Ref no
				rModel.set('refnr', record.data.refnr);
				// Invoice date
				rModel.set('invdt', record.data.bldat);
				// Text note
				rModel.set('texts', record.data.txz01);
				// Invoice amt
				rModel.set('itamt', record.data.netwr);
				// Currency
				rModel.set('ctyp1', record.data.ctype);
				//rModel.set('amount', 100+Math.random());
				rModel.set('lifnr', record.data.lifnr);

			}
			grid.getSelectionModel().deselectAll();
			_this.apDialog.hide();
		});
		
		// for set readonly grid
		this.store.on('load', function(store, rs){
			if(_this.readOnly){
				var view = _this.getView();
				var t = _this.getView().getEl().down('table');
				t.addCls('mask-grid-readonly');
				_this.readOnlyMask = new Ext.LoadMask(t, {
					msg:"..."
				});
				_this.readOnlyMask.show();
			}else{
				if(_this.readOnlyMask)
					_this.readOnlyMask.hide();
			}
		});

		return this.callParent(arguments);
	},

	load: function(options){
		this.store.load({
			params: options
		});
	},

	addRecord: function(){
		// หา record ที่สร้างใหม่ล่าสุด
		var newId = -1;
		this.store.each(function(r){
			if(r.get('id')<newId)
				newId = r.get('id');
		});
		newId--;

		// add new record
		rec = { id:newId, invnr:'' };
		edit = this.editing;
		edit.cancelEdit();
		// find current record
		var sel = this.getView().getSelectionModel().getSelection()[0];
		var selIndex = this.store.indexOf(sel);
		this.store.insert(selIndex+1, rec);
		edit.startEditByPosition({
			row: selIndex+1,
			column: 0
		});

		this.runNumRow();
		this.getSelectionModel().deselectAll();
	},
	
	copyRecord: function(){
		var _this=this;

		var sel = _this.getView().getSelectionModel().getSelection()[0];
		if(sel){
			// หา record ที่สร้างใหม่ล่าสุด
			var newId = -1;
			this.store.each(function(r){
				if(r.get('id')<newId)
					newId = r.get('id');
			});
			newId--;

	        var cur = _this.curValue;
			// add new record
			rec = sel.getData();
			//console.log(rec);
			rec.id = newId;
			//rec = { id:newId, ctype:cur };
			edit = this.editing;
			edit.cancelEdit();
			// find current record
			//var sel = this.getView().getSelectionModel().getSelection()[0];
			var selIndex = this.store.indexOf(sel);
			this.store.insert(selIndex+1, rec);
			edit.startEditByPosition({
				row: selIndex+1,
				column: 0
			});

			this.runNumRow();

			this.getSelectionModel().deselectAll();
		}else{
			Ext.Msg.alert('Warning', 'Please select record to copy.');
		}
	},

	removeRecord: function(grid, rowIndex){
		this.store.removeAt(rowIndex);

		this.runNumRow();
		this.getSelectionModel().deselectAll();
	},

	runNumRow: function(){
		var row_num = 0;
		this.store.each(function(r){
			r.set('ebelp', row_num++);
		});
	},

	getData: function(){
		var rs = [];
		this.store.each(function(r){
			rs.push(r.getData());
		});
		return rs;
	},
	setVendorCode: function(lifnr){
		this.vendorCode = lifnr;
		var field = this.apDialog.searchForm.form.findField('lifnr');
		field.setValue(lifnr);
		//field.setReadOnly(true);
		this.apDialog.grid.load();
	}
});