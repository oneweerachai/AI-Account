<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Servicexml extends CI_Controller {

	function __construct()
	{
		parent::__construct();
		$this->load->model('email_service','',TRUE);
		$this->load->model('code_model2','',TRUE);
	}
		
	function convert()
	{
		$response = "";
		function check_exist_pk($dataxml,$_this){
			$_response = "";
			$id = $dataxml['refnr'];
			$_this->db->where('refnr',$id);
			$query = $_this->db->get('mara');
			
			if($query->num_rows()>0){
				$_response = "Edit";
				return $_response;
			}
			else{
				$_response = "Create";
				return $_response;
			}
		}
		
		function check_exist_service($serv_code,$_this,$_result){
			$_response = $_result;
			$id = $serv_code;
			$_this->db->where('refnr',$id);
			$query = $_this->db->get('mara');
			$str = "";
			if($query->num_rows()>0){
				$arry_query = $query->result_array();
				if($arry_query[0]['statu']=="03"){
					array_push($_response,"Service ".$serv_code." has been rejected");
					return $_response;
				}
				return $_response;
			}
			else{
				array_push($_response,"Service ".$serv_code." is not exist");
				return $_response;
			}
		}
		
		
		$doc = new DOMDocument();
		if($_REQUEST['url']){
		$doc->load($_REQUEST['url']);
		$service = array(
					'maktx'=>$doc->getElementsByTagName('ServiceName')->item(0)->nodeValue,
					'mtart'=>'SV', //ServiceType
					'meins'=>$doc->getElementsByTagName('Unit1')->item(0)->nodeValue,
					'statu'=>"01",
					'refnr'=>$doc->getElementsByTagName('ServiceCode')->item(0)->nodeValue
					);
		
		//$customer = check_exist_pk($customer,$this);
		$response = check_exist_pk($service,$this);
			if($response=="Create"){
				$id = $this->code_model2->generate2('SV');
				$service['matnr']=$id;
				$username = "BMS";
				db_helper_set_now($this, 'erdat');
				$this->db->set('ernam', $username);
				$this->db->insert('mara', $service);
			}
			if($response=="Edit"){
				//Verify Data
				$result = array();
				$result = check_exist_service($doc->getElementsByTagName('ServiceCode')->item(0)->nodeValue,$this,$result);
				if(count($result)>0){
					echo json_encode(array(
					'success'=>false,
					'error'=>$result));
					return;
				}		
				else{
					$this->db->where('refnr', $service['refnr']);
					$this->db->update('mara',$service);
				}
			}
			echo json_encode(array(
			'success'=>true,
			'data'=>$service
			));
		}
		else {
			echo json_encode(array(
				'success'=>false
			));
		}
		
		try{
				if($response=="Create"){$post_id = $service['matnr'];}
				else{
					$res = $this->db->get('mara');
					$res_arry = $res->result_array();
					$post_id = $res_arry[0]['matnr'];
				}
				$total_amount = '0';
				// send notification email
				if($post_id!=""){
					$q_row = $this->db->get_where('mara', array('matnr'=>$post_id));
					$row = $q_row->first_row();
					$this->email_service->sendmail_create(
						'SV', 'Service master',
						$post_id, $total_amount,
						$row->ernam
					);
				}
			}catch(exception $e){}				
	}

}
	