//http://www.sencha.com/blog/using-ext-loader-for-your-application

Ext.define('Account.Journaltemp.Grid', {
	extend	: 'Ext.grid.Panel',
	constructor:function(config) {

		return this.callParent(arguments);
	},
	initComponent : function() {
		this.store = new Ext.data.JsonStore({
			// store configs
			proxy: {
				type: 'ajax',
				url: __site_url+'journaltemp/loads',
				reader: {
					type: 'json',
					root: 'rows',
					idProperty: 'tranr',
					totalProperty: 'totalCount'
				},
				simpleSortMode: true
			},
			fields: [
				'typtx',
				'tranr',
				'txz01'
			],
			remoteSort: true,
			sorters: [{property: 'tranr', direction: 'ASC'}]
		});

		this.columns = [
	     	{text: "Journal Type", align: 'center',
			width: 100, dataIndex: 'typtx', sortable: true},
			{text: "Template Code", align: 'center',
			width: 100, dataIndex: 'tranr', sortable: true},
			{text: "Template Name", 
			width: 290, dataIndex: 'txz01', sortable: true}
		];

		this.bbar = {
			xtype: 'pagingtoolbar',
			pageSize: 10,
			store: this.store,
			displayInfo: true
		};

		return this.callParent(arguments);
	},
	load: function(options){
		this.store.load(options);
	}
});


