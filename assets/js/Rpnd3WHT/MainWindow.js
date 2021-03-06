Ext.define('Account.Rpnd3WHT.MainWindow', {
	extend	: 'Ext.window.Window',

	constructor:function(config) {

		Ext.apply(this, {
			title: 'เลือกเดือนที่ต้องการดู รายงาน ภ.ง.ด. 3',
			closeAction: 'hide',
			height: 130,
			width: 400,
			layout: 'border',
			//layout: 'accordion',
			resizable: true,
			modal: true
		});

		return this.callParent(arguments);
	},
	initComponent : function() {
		var _this=this;
		
		//this.itemDialog = Ext.create('Account.RReceiptVat.Item.Window');

		this.form = Ext.create('Account.Rpnd1WHT.Form',{ region:'center' });

		this.previewDialog = Ext.create('Account.Rpnd3WHT.PreviewWindow');
		this.previewDialog2 = Ext.create('Account.Rpnd3WHT.PreviewWindow2');
		this.previewDialog3 = Ext.create('Account.Rpnd3WHT.PreviewWindow3');

		this.items = [
		     this.form
		];
		
		this.btnPreview = Ext.create('Ext.Button', {
			text: 'รายงานภาษีหัก ณ ที่จ่าย ภ.ง.ด.3',
			disabled: !UMS.CAN.DISPLAY('TR'),
			handler: function() {
				var form_basic = _this.form.getForm();
				if(form_basic.isValid()){
					_this.previewDialog.openDialog(form_basic.getValues());
				}
			}
		});
		
		this.btnPreview2 = Ext.create('Ext.Button', {
			text: 'ฟอร์มแบบนำส่ง ภ.ง.ด.3',
			disabled: !UMS.CAN.DISPLAY('TF'),
			handler: function() {
				var form_basic = _this.form.getForm();
				if(form_basic.isValid()){
					_this.previewDialog2.openDialog(form_basic.getValues());
				}
			}
		});
		
		this.btnPreview3 = Ext.create('Ext.Button', {
			text: 'ใบแนบ ภ.ง.ด.3',
			disabled: !UMS.CAN.DISPLAY('TF'),
			handler: function() {
				var form_basic = _this.form.getForm();
				if(form_basic.isValid()){
					_this.previewDialog3.openDialog(form_basic.getValues());
				}
			}
		});

		this.buttons = [this.btnPreview, 
		this.btnPreview3, this.btnPreview2];
		
		// set handler for item grid store
		//this.itemDialog.grid.store.on('beforeload', function(store){
		//	var formValues = _this.form.getForm().getValues();
		//	store.getProxy().extraParams = formValues;
		//});

		return this.callParent(arguments);
	}
});