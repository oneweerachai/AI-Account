Ext.define('Account.RGR.Item.Grid', {
	extend	: 'Ext.grid.Panel',
	constructor:function(config) {
		return this.callParent(arguments);
	},

	initComponent : function() {
		this.store = new Ext.data.JsonStore({
			proxy: {
				type: 'ajax',
				url: __site_url+"gr/loads",
				reader: {
					type: 'json',
					root: 'rows',
					idProperty: 'mbeln'
				}
			},
			fields: [
			    'mbeln',
				'bldat',
				'lifnr',
				'name1',
				'netwr',
				'statx'
			],
			remoteSort: true,
			sorters: ['mbeln ASC']
		});

		this.columns = [
			{text: "GR No", flex: true, dataIndex: 'mbeln', sortable: true},
			{text: "GR Date", width: 125, dataIndex: 'bldat', sortable: true},
			{text: "Vendor Code", flex: true, dataIndex: 'lifnr', sortable: true},
			{text: "Vendor Name", flex: true, dataIndex: 'name1', sortable: true},
			{text: "Net Amount", flex: true, dataIndex: 'netwr', sortable: true},
			{text: "GR Status", flex: true, dataIndex: 'statx', sortable: true}
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
		this.store.load({
			params: options
		});
	}
});