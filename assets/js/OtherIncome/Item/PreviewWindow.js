Ext.define('Account.OtherIncome.Item.PreviewWindow', {
	extend	: 'BASE.PreviewWindow',
	constructor:function(config) {

		Ext.apply(this, {
			title: 'Other Income preview',
			closeAction: 'hide',
			height: 600,
			width: 830,
			minHeight: 600,
			minWidth: 830,
			layout: 'border',
			border: false,
			resizable: true,
			modal: true,
			buttonAlign:'center'
		});

		return this.callParent(arguments);
	},
	initComponent : function() {
		
		return this.callParent(arguments);
	},
	
	getFrameUrl: function(id, copies){
		copies = copies || 1;
		return __site_url+'form/invoice/index/'+id+'/'+copies;
	}
});