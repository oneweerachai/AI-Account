Ext.define('Account.Billto.MainWindow', {
	extend	: 'Ext.window.Window',
	constructor:function(config) {

		Ext.apply(this, {
			title: 'Billing Note',
			closeAction: 'hide',
			height: 700,
			minHeight: 380,
			width: 960,
			minWidth: 500,
			resizable: true,
			modal: false,
			layout:'border',
			maximizable: true,
			minimizable: true,
			listeners: {
				minimize: function(win,obj) {
					if(!win.getCollapsed())
						win.collapse(Ext.Component.DIRECTION_BOTTOM, false);
					else
						win.expand(false);
				}
			}
		});

		return this.callParent(arguments);
	},

	initComponent : function() {
		var _this=this;

		// --- object ---
		this.addAct = new Ext.Action({
			text: 'Add',
			iconCls: 'b-small-plus',
			disabled: !UMS.CAN.CREATE('BT')
		});
		this.editAct = new Ext.Action({
			text: 'Edit',
			iconCls: 'b-small-pencil',
			disabled: !(UMS.CAN.DISPLAY('BT') || UMS.CAN.CREATE('BT') || UMS.CAN.EDIT('BT'))
		});
		this.displayAct = new Ext.Action({
			text: 'Display',
			iconCls: 'b-small-search',
			disabled: !UMS.CAN.DISPLAY('BT')
		});
		this.deleteAct = new Ext.Action({
			text: 'Delete',
			disabled: true,
			iconCls: 'b-small-minus',
			disabled: !UMS.CAN.DELETE('BT')
		});
        this.excelAct = new Ext.Action({
			text: 'Excel',
			iconCls: 'b-small-excel',
			disabled: !UMS.CAN.EXPORT('BT')
		});
		this.importAct = new Ext.Action({
			text: 'Import',
			disabled: true,
			iconCls: 'b-small-import'
		});
		
		this.itemDialog = Ext.create('Account.Billto.Item.Window');
		
		this.grid = Ext.create('Account.Billto.Grid', {
			region:'center',
			border: false,
			tbar: [this.addAct, this.editAct, this.displayAct, this.deleteAct, this.excelAct,this.importAct]
		});
		
		//this.searchForm = Ext.create('Account.Billto.FormSearch', {
		//	region: 'north',
		//	height:100
		//});
		
		var searchOptions = {
			region: 'north',
			height:100
		};
		
		if(this.isApproveOnly){
			searchOptions.status_options = {
				value: '02',
				readOnly: true
			};
		}

		this.searchForm = Ext.create('Account.Billto.FormSearch', searchOptions);

		this.items = [this.searchForm, this.grid];

		//this.tbar = [this.addAct, this.editAct, this.deleteAct,
		//this.excelAct,this.importAct];

		// --- event ---
		this.addAct.setHandler(function(){
			_this.itemDialog.openDialog();
			_this.itemDialog.setTitle('Create Billing Note');
			/*
			_this.itemDialog.form.reset();
			_this.itemDialog.show();
			*/
		});

		this.editAct.setHandler(function(){
			var sel = _this.grid.getView().getSelectionModel().getSelection()[0];
			var id = sel.data[sel.idField.name];
			
			if(id){
				_this.itemDialog.openDialog(id);
				_this.itemDialog.setReadOnly(false);
				_this.itemDialog.setTitle('Edit Billing Note');
				//_this.itemDialog.show();
				//_this.itemDialog.form.load(id);

				// สั่ง pr_item grid load
				//_this.itemDialog.form.gridItem.load({ebeln: id});
			}
		});
		
		this.displayAct.setHandler(function(){
			var sel = _this.grid.getView().getSelectionModel().getSelection()[0];
			var id = sel.data[sel.idField.name];
			if(id){
				_this.itemDialog.openDialog(id);
				_this.itemDialog.setReadOnly(true);
				_this.itemDialog.setTitle('Display Billing Note');
			}
		});

		this.deleteAct.setHandler(function(){
			var sel = _this.grid.getView().getSelectionModel().getSelection()[0];
			var id = sel.data[sel.idField.name];
			if(id){
				_this.itemDialog.form.remove(id);
			}
		});

		this.itemDialog.form.on('afterSave', function(form, action){
			_this.itemDialog.hide();
			_this.grid.load();

			var resultId = action.result.data.id;
			_this.itemDialog.openDialog(resultId);
			Ext.Msg.alert('Status', 'Save Billing Note number: '+resultId+' successfully.');
		});

		this.itemDialog.form.on('afterDelete', function(){
			_this.grid.load();
		});

        this.itemDialog.form.on('afterDelete', function(){
			_this.grid.load();
		});
        
        this.searchForm.on('search_click', function(values){
			_this.grid.load();
		});
		this.searchForm.on('reset_click', function(values){
			_this.grid.load();
		});
		
		this.grid.store.on("beforeload", function (store, opts) {
			opts.params = opts.params || {};
			if(opts.params){
				var formValues = _this.searchForm.getValues();
				Ext.apply(opts.params, formValues);
			}
	    });

		if(this.gridParams && !Ext.isEmpty(this.gridParams)){
			this.grid.store.on('beforeload', function (store, opts) {
				opts.params = opts.params || {};
				if(opts.params){
					opts.params = Ext.apply(opts.params, _this.gridParams);
				}
		    });
		}
        
        if(!this.disableGridDoubleClick){
	    this.grid.getView().on('itemdblclick', function(grid, record, item, index){
	    	_this.editAct.execute();
	    });
	    }
	    
	    this.excelAct.setHandler(function(){
			var params = _this.searchForm.getValues(),
				sorters = (_this.grid.store.sorters && _this.grid.store.sorters.length)?_this.grid.store.sorters.items[0]:{};
			params = Ext.apply({
				sort: sorters.property,
				dir: sorters.direction
			}, params);
			query = Ext.urlEncode(params);
			window.location = __site_url+'export/billto/index?'+query;
		});
	    
		// --- after ---
		this.grid.load();

		return this.callParent(arguments);
	}
});