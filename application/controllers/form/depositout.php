<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Depositout extends CI_Controller {
    public $query;
    public $strSQL;
	function __construct()
	{
		parent::__construct();

		$this->load->model('convert_amount','',TRUE);
	}
	
	function index()
	{
		$comid = XUMS::COMPANY_ID();
		$strSQL="";//echo $comid;
		$strSQL= " select tbl_comp.* from tbl_comp where tbl_comp.comid = '".$comid."'";
		$q_com = $this->db->query($strSQL);
		$r_com = $q_com->first_row('array');
		if($q_com->num_rows()>0){
		
		$no = $type = $this->uri->segment(4);
		$copies = intval($type = $this->uri->segment(5));
		if($copies<=0) $copies = 1;
		
	    $strSQL = " select v_ebdk.*,v_ebdp.*";
        $strSQL = $strSQL . " from v_ebdk ";
        $strSQL = $strSQL . " left join v_ebdp on v_ebdk.depnr = v_ebdp.depnr ";
        $strSQL = $strSQL . " Where v_ebdk.depnr = '$no'  ";
        $strSQL .= "ORDER BY vbelp ASC";
		
		$query = $this->db->query($strSQL);
		$r_data = $query->first_row('array');
		
		if(!empty($r_data['adr01'])){
		$ads00 = explode('Kwang',$r_data['adr01']);
		//echo 'aaa'.$ads00->num_rows().$ads00[1];
		if(empty($ads00[1])){
		   $ads00 = explode('kwang',$r_data['adr01']);
		   if(empty($ads00[1])){
			   $ads00 = explode('แขวง',$r_data['adr01']);
			   if(!empty($ads00[1])){
				   $ads00[1] = 'แขวง'.$ads00[1];
				   }else{
					   $ads00[0]=$r_data['adr01'];
					   $ads00[1]='';
					   }
		   }else{ $ads00[1] = 'kwang'.$ads00[1]; }
		}else{ $ads00[1] = 'Kwang'.$ads00[1]; }
		}
		
		// calculate sum
		$rows = $query->result_array();
		$b_amt = 0;
		$v_amt = 0;
		foreach ($rows as $key => $item) {
			$itamt = 0;
			$itamt = $item['menge'] * $item['unitp'];
			$itamt = $itamt - $item['disit'];
			$b_amt += $itamt;
			$v=0;
			if(!empty($r_data['chk01']))
			{
			   $v = $itamt * $r_data['taxpr'];
			   $v = $v / 100;
			   $v_amt += $v;
			}
		}

		function check_page($page_index, $total_page, $value){
			return ($page_index==0 && $total_page>1)?"":$value;
		}
        ?>
<HTML xmlns="http://www.w3.org/1999/xhtml">
	<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<script>

 ie4up=nav4up=false;
 var agt = navigator.userAgent.toLowerCase();
 var major = parseInt(navigator.appVersion);
 if ((agt.indexOf('msie') != -1) && (major >= 4))
   ie4up = true;
 if ((agt.indexOf('mozilla') != -1)  && (agt.indexOf('spoofer') == -1) && (agt.indexOf('compatible') == -1) && ( major>= 4))
   nav4up = true;
</script>

<script type="text/javascript">
	function do_print() {
		window.print()
	}
</script>

<STYLE>
body { FONT-FAMILY:'Angsana New';}
 A {text-decoration:none}
 A IMG {border-style:none; border-width:0;}
 DIV {position:absolute; z-index:25;}
.fc1-0 { COLOR:0000FF;FONT-SIZE:15PT;FONT-FAMILY:'Angsana New';FONT-WEIGHT:BOLD;}
.fc1-1 { COLOR:0000FF;FONT-SIZE:15PT;FONT-FAMILY:'Angsana New';FONT-WEIGHT:BOLD;}
.fc1-2 { COLOR:0000FF;FONT-SIZE:13PT;FONT-FAMILY:'Angsana New';FONT-WEIGHT:BOLD;}
.fc1-3 { COLOR:000000;FONT-SIZE:13PT;FONT-WEIGHT:NORMAL;}
.fc1-4 { COLOR:0000FF;FONT-SIZE:12PT;FONT-WEIGHT:NORMAL;}
.fc1-5 { COLOR:0000FF;FONT-SIZE:11PT;FONT-WEIGHT:NORMAL;}
.fc1-6 { COLOR:000000;FONT-SIZE:13PT;FONT-WEIGHT:NORMAL;}
.fc1-7 { COLOR:000000;FONT-SIZE:15PT;FONT-WEIGHT:NORMAL;}
.fc1-8 { COLOR:000000;FONT-SIZE:13PT;FONT-WEIGHT:NORMAL;}
.fc1-9 { COLOR:000000;FONT-SIZE:13PT;FONT-WEIGHT:NORMAL;}
.fc1-10 { COLOR:000000;FONT-SIZE:13PT;FONT-FAMILY:'Angsana New';FONT-WEIGHT:BOLD;}
.fc1-11 { COLOR:0000FF;FONT-SIZE:9PT;FONT-WEIGHT:NORMAL;}
.fc1-12 { COLOR:0000FF;FONT-SIZE:11PT;FONT-WEIGHT:NORMAL;}
.ad1-0 {border-color:000000;border-style:none;border-bottom-width:0PX;border-left-width:0PX;border-top-width:0PX;border-right-width:0PX;}
.ad1-1 {border-color:000000;border-style:none;border-bottom-width:0PX;border-left-width:0PX;border-top-width:0PX;border-right-width:0PX;}
.ad1-2 {border-color:0000FF;border-style:none;border-bottom-width:0PX;border-left-style:solid;border-left-width:1PX;border-top-width:0PX;border-right-width:0PX;}
.ad1-3 {border-color:0000FF;border-style:none;border-bottom-width:0PX;border-left-width:0PX;border-top-style:solid;border-top-width:1PX;border-right-width:0PX;}
.ad1-4 {border-color:0000FF;border-style:none;border-bottom-width:0PX;border-left-width:0PX;border-top-style:solid;border-top-width:1PX;border-right-width:0PX;}
.ad1-5 {border-color:0000FF;border-style:none;border-bottom-style:solid;border-bottom-width:1PX;border-left-style:solid;border-left-width:1PX;border-top-style:solid;border-top-width:1PX;border-right-style:solid;border-right-width:1PX;}
.ad1-6 {border-color:0000FF;border-style:none;border-bottom-style:solid;border-bottom-width:1PX;border-left-style:solid;border-left-width:1PX;border-top-style:solid;border-top-width:1PX;border-right-style:solid;border-right-width:1PX;}
.ad1-7 {border-color:0000FF;border-style:none;border-bottom-style:solid;border-bottom-width:1PX;border-left-style:solid;border-left-width:1PX;border-top-style:solid;border-top-width:1PX;border-right-style:solid;border-right-width:1PX;}
.ad1-8 {border-color:0000FF;border-style:none;border-bottom-style:solid;border-bottom-width:1PX;border-left-style:solid;border-left-width:1PX;border-top-style:solid;border-top-width:1PX;border-right-style:solid;border-right-width:1PX;}

.break { page-break-before: always; }

</STYLE>
<!--<TITLE>Crystal Report Viewer</TITLE>-->
</head>
<BODY BGCOLOR="FFFFFF"LEFTMARGIN=0 TOPMARGIN=0 BOTTOMMARGIN=0 RIGHTMARGIN=0>

<?php
$current_copy_index = 0;
for($current_copy_index=0;$current_copy_index<$copies;$current_copy_index++):

	// check total page
	$page_size = 10;
	$total_count = count($rows);
	$total_page = ceil($total_count / $page_size);
	$real_current_page = 0;
	for($current_page_index=0; $current_page_index<$total_page; $current_page_index++):
		echo '<div';
		if($real_current_page>0)
			echo ' class="break"';
		echo ' style="position:relative; height:1100px;">';
		$real_current_page++;
?>

<DIV style="z-index:0"> &nbsp; </div>

<div style="left: 460PX; top: 296px; border-color: 0000FF; border-style: solid; border-width: 0px; border-left-width: 1PX; height: 50px;">
<table width="0px" height="64PX"><td>&nbsp;</td></table>
</div>
<div style="left: 602PX; top: 296px; border-color: 0000FF; border-style: solid; border-width: 0px; border-left-width: 1PX; height: 50px;">
<table width="0px" height="64PX"><td>&nbsp;</td></table>
</div>
<div style="left: 660PX; top: 296px; border-color: 0000FF; border-style: solid; border-width: 0px; border-left-width: 1PX; height: 50px;">
<table width="0px" height="64PX"><td>&nbsp;</td></table>
</div>
<div style="left: 157PX; top: 296px; border-color: 0000FF; border-style: solid; border-width: 0px; border-left-width: 1PX; height: 50px;">
<table width="0px" height="64PX"><td>&nbsp;</td></table>
</div>

<div style="left:49PX;top:395PX;border-color:0000FF;border-style:solid;border-width:0px;border-top-width:1PX;width:705PX;">
</div>
<div style="left:49PX;top:317PX;border-color:0000FF;border-style:solid;border-width:0px;border-top-width:1PX;width:703PX;">
</div>

<div style="left:660PX;top:350PX;border-color:0000FF;border-style:solid;border-width:0px;border-left-width:1PX;height:574PX;">
<table width="0px" height="568PX"><td>&nbsp;</td></table>
</div>
<div style="left:121PX;top:351PX;border-color:0000FF;border-style:solid;border-width:0px;border-left-width:1PX;height:310PX;">
  <table width="0px" height="304PX"><td>&nbsp;</td></table>
</div>
<div style="left:385PX;top:351PX;border-color:0000FF;border-style:solid;border-width:0px;border-left-width:1PX;height:310PX;">
  <table width="0px" height="304PX"><td>&nbsp;</td></table>
</div>
<div style="left:520PX;top:350PX;border-color:0000FF;border-style:solid;border-width:0px;border-left-width:1PX;height:311PX;">
<table width="0px" height="305PX"><td>&nbsp;</td></table>
</div>

<div style="left:49PX;top:660PX;border-color:0000FF;border-style:solid;border-width:0px;border-top-width:1PX;width:705PX;">
</div>
<div style="left:232PX;top:951PX;border-color:0000FF;border-style:solid;border-width:0px;border-left-width:1PX;height:128PX;">
<table width="0px" height="122PX"><td>&nbsp;</td></table>
</div>
<div style="left:520PX;top:862PX;border-color:0000FF;border-style:solid;border-width:0px;border-left-width:1PX;height:63PX;">
<table width="0px" height="57PX"><td>&nbsp;</td></table>
</div>
<div style="left:49PX;top:923PX;border-color:0000FF;border-style:solid;border-width:0px;border-top-width:1PX;width:705PX;">
</div>
<div style="left:49PX;top:862PX;border-color:0000FF;border-style:solid;border-width:0px;border-top-width:1PX;width:703PX;">
</div>
<div style="left:49PX;top:884PX;border-color:0000FF;border-style:solid;border-width:0px;border-top-width:1PX;width:705PX;">
</div>
<div style="left:57PX;top:1041PX;border-color:0000FF;border-style:solid;border-width:0px;border-top-width:1PX;width:170PX;">
</div>
<div style="left:238PX;top:1041PX;border-color:0000FF;border-style:solid;border-width:0px;border-top-width:1PX;width:160PX;">
</div>
<div style="left:410PX;top:1041PX;border-color:0000FF;border-style:solid;border-width:0px;border-top-width:1PX;width:152PX;">
</div>
<div style="left:460PX;top:682PX;border-color:0000FF;border-style:solid;border-width:0px;border-top-width:1PX;width:294PX;">
</div>
<div style="left:460PX;top:705PX;border-color:0000FF;border-style:solid;border-width:0px;border-top-width:1PX;width:294PX;">
</div>
<div style="left:459PX;top:727PX;border-color:0000FF;border-style:solid;border-width:0px;border-top-width:1PX;width:295PX;">
</div>
<div style="left:459PX;top:749PX;border-color:0000FF;border-style:solid;border-width:0px;border-top-width:1PX;width:295PX;">
</div>
<div style="left:460PX;top:772PX;border-color:0000FF;border-style:solid;border-width:0px;border-top-width:1PX;width:294PX;">
</div>
<div style="left:460PX;top:794PX;border-color:0000FF;border-style:solid;border-width:0px;border-top-width:1PX;width:294PX;">
</div>
<div style="left:460PX;top:817PX;border-color:0000FF;border-style:solid;border-width:0px;border-top-width:1PX;width:294PX;">
</div>
<div style="left:460PX;top:839PX;border-color:0000FF;border-style:solid;border-width:0px;border-top-width:1PX;width:294PX;">
</div>
<div style="left:157PX;top:862PX;border-color:0000FF;border-style:solid;border-width:0px;border-left-width:1PX;height:62PX;">
<table width="0px" height="56PX"><td>&nbsp;</td></table>
</div>
<div style="left:49PX;top:951PX;border-color:0000FF;border-style:solid;border-width:0px;border-top-width:1PX;width:705PX;">
</div>
<div style="left:403PX;top:951PX;border-color:0000FF;border-style:solid;border-width:0px;border-left-width:1PX;height:128PX;">
<table width="0px" height="122PX"><td>&nbsp;</td></table>
</div>
<div style="left:307PX;top:861PX;border-color:0000FF;border-style:solid;border-width:0px;border-left-width:1PX;height:63PX;">
<table width="0px" height="57PX"><td>&nbsp;</td></table>
</div>
<div style="left:569PX;top:951PX;border-color:0000FF;border-style:solid;border-width:0px;border-left-width:1PX;height:128PX;">
<table width="0px" height="122PX"><td>&nbsp;</td></table>
</div>
<div style="left:584PX;top:1041PX;border-color:0000FF;border-style:solid;border-width:0px;border-top-width:1PX;width:152PX;">
</div>

<DIV style="z-index:10;left:278PX;top:105PX;width:270PX;height:59PX;clip: rect(0PX,268PX,59PX,0PX);background-color:0000FF;layer-background-color:0000FF;"></DIV>
<DIV class="box" style="z-index:10; border-color:0000FF;border-style:solid;border-bottom-style:solid;border-bottom-width:1PX;border-left-style:solid;border-left-width:1PX;border-top-style:solid;border-top-width:1PX;border-right-style:solid;border-right-width:1PX;left:278PX;top:105PX;width:263PX;height:54PX;background-color:FFFFFF;layer-background-color:FFFFFF;">
<table border=0 cellpadding=0 cellspacing=0 width=197px height=47px><TD>&nbsp;</TD></TABLE>
</DIV>

<DIV class="box" style="z-index: 10; border-color: 0000FF; border-style: solid; border-bottom-style: solid; border-bottom-width: 1PX; border-left-style: solid; border-left-width: 1PX; border-top-style: solid; border-top-width: 1PX; border-right-style: solid; border-right-width: 1PX; left: 48PX; top: 169PX; width: 498px; height: 125px;">
<table border=0 cellpadding=0 cellspacing=0 width=498px height=94px><TD>&nbsp;</TD></TABLE>
</DIV>

<DIV class="box" style="z-index: 10; border-color: 0000FF; border-style: solid; border-bottom-style: solid; border-bottom-width: 1PX; border-left-style: solid; border-left-width: 1PX; border-top-style: solid; border-top-width: 1PX; border-right-style: solid; border-right-width: 1PX; left: 49PX; top: 296px; width: 704PX; height: 49px;">
<table border=0 cellpadding=0 cellspacing=0 width=697px height=62px><TD>&nbsp;</TD></TABLE>
</DIV>

<DIV class="box" style="z-index:10; border-color:0000FF;border-style:solid;border-bottom-style:solid;border-bottom-width:1PX;border-left-style:solid;border-left-width:1PX;border-top-style:solid;border-top-width:1PX;border-right-style:solid;border-right-width:1PX;left:49PX;top:350PX;width:704PX;height:728PX;">
<table border=0 cellpadding=0 cellspacing=0 width=697px height=721px><TD>&nbsp;</TD></TABLE>
</DIV>

<!--Copies-->
<?php if($current_copy_index>0): ?>
<DIV style="left:571PX;top:26PX;width:40PX;height:20PX;"><span class="fc1-2">สำเนา</span></DIV>
<DIV style="left:605PX;top:24PX;width:112PX;height:25PX;"><span class="fc1-3"><?= $current_copy_index ?></span></DIV>
<?php else: ?>
<DIV style="left:571PX;top:26PX;width:40PX;height:20PX;"><span class="fc1-2">ต้นฉบับ</span></DIV>
<?php endif; ?>

<!--Page No-->
<DIV style="left:635PX;top:26PX;width:30PX;height:20PX;"><span class="fc1-2">Page</span></DIV>
<DIV style="left:665PX;top:24PX;width:112PX;height:25PX;"><span class="fc1-3"><?=($current_page_index+1).'/'.$total_page;?></span></DIV>

<!--Header Text-->
<DIV style="left:278PX;top:128PX;width:263PX;height:21PX;TEXT-ALIGN:CENTER;"><span class="fc1-0">DEPOSIT PAYMENT</span></DIV>

<DIV style="left:278PX;top:109PX;width:263PX;height:25PX;TEXT-ALIGN:CENTER;"><span class="fc1-0">ใบจ่ายเงินมัดจำ</span></DIV>

<DIV style="left: 48px; top: 130PX; width: 152px; height: 20PX;"><span class="fc1-2">เลขประจำตัวผู้เสียภาษีอากร</span></DIV>

<DIV style="left: 49px; top: 145PX; width: 149PX; height: 20PX;TEXT-ALIGN:CENTER;"><span class="fc1-2"><?= $r_com['taxid']; ?></span></DIV>

<DIV style="left: 217px; top: 130px; width: 38px; height: 20PX;"><span class="fc1-2">สาขาที่</span></DIV>

<DIV style="left: 216px; top: 145px; width: 39px; height: 20PX; TEXT-ALIGN: CENTER;"><span class="fc1-2"><?= $r_com['brach']; ?></span></DIV>
<?php
$bldat_str = util_helper_format_date($r_data['bldat']);
?>

<!--Company Logo-->
<DIV style="z-index:15;left:51PX;top:26PX;width:102PX;height:102PX;">
<img  WIDTH=106 HEIGHT=100 SRC="<?= base_url('assets/images/icons/bmblogo.jpg') ?>">
</DIV>

<!--Company Text-->
<DIV style="left:157PX;top:26PX;width:590PX;height:26PX;"><span class="fc1-1"><?= $r_com['name1']; ?></span></DIV>

<DIV style="left:159PX;top:52PX;width:585PX;height:56PX;">
<table width="580PX" border=0 cellpadding=0 cellspacing=0><td class="fc1-4"><?=$r_com['adr01'];?>&nbsp;<?=$r_com['distx'];?>&nbsp;&nbsp;<?=$r_com['pstlz'];?></td></table>

<table width="580PX" border=0 cellpadding=0 cellspacing=0><td class="fc1-4">Tel. <?=$r_com['telf1'];?>&nbsp;&nbsp;&nbsp;Fax. <?=$r_com['telfx'];?></td></table>
</DIV>

<!--Vendor Name-->
<DIV style="left: 57PX; top: 176PX; width: 69px; height: 22PX;"><span class="fc1-2">ชื่อผู้จำหน่าย</span></DIV>

<DIV style="left:57PX;top:198PX;width:52PX;height:22PX;"><span class="fc1-2">Supplier</span></DIV>

<DIV style="left: 127px; top: 173PX; width: 382px; height: 26PX;"><span class="fc1-7"><?=$r_data['name1'];?></span></DIV>

<DIV style="left: 128px; top: 198PX; width: 419px; height: 23PX;"><span class="fc1-8"><?=$ads00[0];?></span></DIV>

<DIV style="left: 128px; top: 219px; width: 419px; height: 23PX;"><span class="fc1-8"><?=$ads00[1];?>&nbsp;&nbsp;<?=$r_data['distx'];?>&nbsp;&nbsp;<?=$r_data['pstlz'];?></span></DIV>

<DIV style="left: 128px; top: 243px; width: 215px; height: 22PX;"><span class="fc1-8">เลขประจำตัวผู้เสียภาษีอากร&nbsp;<?=$r_data['taxid'];?></span></DIV>

<DIV style="left: 362px; top: 243px; width: 89px; height: 22PX;"><span class="fc1-8">สาขาที่&nbsp;<?=$r_data['brach'];?></span></DIV>

<DIV style="left: 127px; top: 267px; width: 28px; height: 21PX;"><span class="fc1-8">Tel.</span></DIV>

<DIV style="left: 287PX; top: 267px; width: 161px; height: 21PX;"><span class="fc1-8">Fax. &nbsp;<?=$r_data['telfx'];?></span></DIV>

<DIV style="left: 159px; top: 269px; width: 124px; height: 21PX;"><span class="fc1-8"><?=$r_data['telf1'];?></span></DIV>

<!--Delivery Place-->
<DIV style="left: 560px; top: 176PX; width: 75PX; height: 20PX;"><span class="fc1-2">เลขที่ (No.)</span></DIV>

<DIV style="left: 635px; top: 174PX; width: 108px; height: 25PX;"><span class="fc1-3"><?=$r_data['depnr'];?></span></DIV>

<DIV style="left: 560px; top: 198PX; width: 76PX; height: 20PX;"><span class="fc1-2">วันที่ (Date) </span></DIV>
<?php 
$bldat_str = util_helper_format_date($r_data['bldat']);
?>
<DIV style="left: 635px; top: 196PX; width: 108PX; height: 21PX;"><span class="fc1-3"><?=$bldat_str?></span></DIV>

<!--Reference Table-->

<DIV style="left:49PX;top:298PX;width:108PX;height:19PX;TEXT-ALIGN:CENTER;"><span class="fc1-5">PO no.</span></DIV>

<DIV style="left:60PX;top:322PX;width:90PX;height:22PX;TEXT-ALIGN:CENTER;"><span class="fc1-6"><?=$r_data['ebeln'];?></span></DIV>

<!--2 Reference-->

<DIV style="left:156PX;top:298PX;width:302PX;height:19PX;TEXT-ALIGN:CENTER;"><span class="fc1-5">Reference</span></DIV>

<DIV style="left:175PX;top:322PX;width:280PX;height:22PX;TEXT-ALIGN:LEFT;"><span class="fc1-6"><?=$r_data['refnr'];?></span></DIV>

<!--3 Vendor code-->

<DIV style="left:456PX;top:298PX;width:142PX;height:19PX;TEXT-ALIGN:CENTER;"><span class="fc1-5">Supplier Code</span></DIV>

<DIV style="left:460PX;top:322PX;width:142PX;height:22PX;TEXT-ALIGN:CENTER;"><span class="fc1-6"><?=$r_data['lifnr'];?></span></DIV>

<!--4 Credit-->

<DIV style="left:598PX;top:298PX;width:58PX;height:19PX;TEXT-ALIGN:CENTER;"><span class="fc1-5">Credit</span></DIV>

<DIV style="left:602PX;top:322PX;width:58PX;height:22PX;TEXT-ALIGN:CENTER;"><span class="fc1-9"><?=$r_data['terms'];?></span></DIV>

<!--5 Delivery date-->

<DIV style="left:660PX;top:298PX;width:93PX;height:19PX;TEXT-ALIGN:CENTER;"><span class="fc1-5">Delivery Date</span></DIV>
<?php
//$lfdat_str = util_helper_format_date($r_data['lfdat']);
?>
<DIV style="left:660PX;top:322PX;width:93PX;height:22PX;TEXT-ALIGN:CENTER;"><span class="fc1-9"></span></DIV>


<!--Item Table-->
<DIV style="left: 49PX; top: 355PX; width: 72px; height: 19PX; TEXT-ALIGN: CENTER;"><span class="fc1-2">ลำดับงวด</span></DIV>
<DIV style="left: 49PX; top: 373PX; width: 72px; height: 20PX; TEXT-ALIGN: CENTER;"><span class="fc1-5">Period No.</span></DIV>
<DIV style="left: 123px; top: 355PX; width: 262px; height: 19PX; TEXT-ALIGN: CENTER;"><span class="fc1-2">รายการ</span></DIV>
<DIV style="left: 123px; top: 373PX; width: 262px; height: 20PX; TEXT-ALIGN: CENTER;"><span class="fc1-5">Description</span></DIV>

<DIV style="left: 385PX; top: 355PX; width: 135px; height: 19PX; TEXT-ALIGN: CENTER;"><span class="fc1-2">วันที่</span></DIV>
<DIV style="left: 385PX; top: 373PX; width: 134px; height: 20PX; TEXT-ALIGN: CENTER;"><span class="fc1-5">Date</span></DIV>
<DIV style="left: 520PX; top: 355PX; width: 140px; height: 19PX; TEXT-ALIGN: CENTER;"><span class="fc1-2">จำนวนเงิน/เปอร์เซ็น</span></DIV>
<DIV style="left: 520PX; top: 373PX; width: 140px; height: 20PX; TEXT-ALIGN: CENTER;"><span class="fc1-5">Amount/Percent</span></DIV>
<DIV style="left:660PX;top:355PX;width:93PX;height:19PX;TEXT-ALIGN:CENTER;"><span class="fc1-2">จำนวนเงิน</span></DIV>
<DIV style="left:660PX;top:373PX;width:93PX;height:20PX;TEXT-ALIGN:CENTER;"><span class="fc1-5">Amount</span></DIV>

<?php
/*
$rows = $query->result_array();
$i=397;$b_amt = 0;
foreach ($rows as $key => $item) {
	//echo $value['total_per_menge']."<br />";
?>
<DIV style="left:49PX;top:<?=$i?>PX;width:32PX;height:19PX;TEXT-ALIGN:CENTER;"><span class="fc1-8"><?=$item['ebelp'];?></span></DIV>
<DIV style="left:81PX;top:<?=$i?>PX;width:77PX;height:19PX;TEXT-ALIGN:CENTER;"><span class="fc1-8"><?=$item['matnr'];?></span></DIV>
<DIV style="left:167PX;top:<?=$i?>PX;width:218PX;height:22PX;"><span class="fc1-8"><?=$item['maktx'];?></span></DIV>
<DIV style="left:385PX;top:<?=$i?>PX;width:71PX;height:19PX;TEXT-ALIGN:RIGHT;"><span class="fc1-8"><?=number_format($item['menge'],2,'.',',');?></span></DIV>
<DIV style="left:520PX;top:<?=$i?>PX;width:78PX;height:19PX;TEXT-ALIGN:RIGHT;"><span class="fc1-8"><?=number_format($item['unitp'],2,'.',',');?></span></DIV>
<DIV style="left:460PX;top:<?=$i?>PX;width:60PX;height:19PX;TEXT-ALIGN:CENTER;"><span class="fc1-8"><?=$item['meins'];?></span></DIV>
<DIV style="left:578PX;top:<?=$i?>PX;width:78PX;height:19PX;TEXT-ALIGN:RIGHT;"><span class="fc1-8"><?=number_format($item['disit'],2,'.',',');?></span></DIV>
<?php 
  $itamt = 0;
  $itamt = $item['menge'] * $item['unitp'];
  $itamt = $itamt - $item['disit'];
  $b_amt += $itamt;
?>
<DIV style="left:660PX;top:<?=$i?>PX;width:88PX;height:19PX;TEXT-ALIGN:RIGHT;"><span class="fc1-8"><?=number_format($itamt,2,'.',',');?></span></DIV>

<?php
$v_amt=0;$v=0;
if(!empty($r_data['chk01']))
{
   $v = $itamt * $r_data['taxpr'];
   $v = $v / 100; 
   $v_amt += $v;
}
$i=397+20;
}*/
?>

<DIV style="left:49PX;top:397px">
<table cellpadding="0" cellspacing="0" border="0">
<?php
$rows = $query->result_array();
for ($i=($current_page_index * $page_size);$i<($current_page_index * $page_size + $page_size) && $i<count($rows);$i++)://$rows as $key => $item):
	$item = $rows[$i];
	$itamt = 0;$pos='';$disc=0;
	//$itamt = $item['menge'] * $item['unitp'];
	//$itamt = $itamt - $item['disit'];
	$itamt = $item['pramt'];
	$duedt_str = util_helper_format_date($r_data['duedt']);
?>
	<tr>
		<td class="fc1-8" align="center" style="width:76px;"><?=$item['vbelp'];?></td>
		
		<td class="fc1-8" align="left" style="width:256px;"><?=$item['sgtxt'];?></td>
		<td class="fc1-8" align="center" style="width:135px;"><?=$duedt_str;?></td>
		<td class="fc1-8" align="right" style="width:140px;"><?php 
		$pos = strpos($item['perct'], '%');
		if($pos==false){
			$disc = $item['perct'];
			echo number_format($disc,2,'.',',');
		}else{
			echo $item['perct'];
		}
		?></td>
		
		<td class="fc1-8" align="right" style="width:93px;"><?=number_format($itamt,2,'.',',');?></td>
	</tr>

<?php
endfor;
?>
</table>
</DIV>

<!--Footer Text-->
<DIV style="left:465PX;top:664PX;width:194PX;height:23PX;"><span class="fc1-4">รวมเงิน&nbsp;&nbsp;Total</span></DIV>
<DIV style="left:660PX;top:664PX;width:92PX;height:19PX;TEXT-ALIGN:RIGHT;"><span class="fc1-10">
<?= check_page($current_page_index, $total_page, number_format($r_data['beamt'],2,'.',',')) ?></span></DIV>
<DIV style="left:465PX;top:686PX;width:101PX;height:23PX;"><span class="fc1-4">ส่วนลด&nbsp;&nbsp;Discount</span></DIV>
<?php
$distxt='';$disamt=0;
/*if(strpos($r_data['dismt'], '%') !== false)
{
	$distxt = $r_data['dismt'];
	$disamt = strstr($distxt, '%', true);
	$disamt = $disamt * $r_data['beamt'];
	$disamt = $disamt / 100;
}else{$disamt = $r_data['dismt'];}*/
if(empty($r_data['dismt'])) $r_data['dismt'] = 0;
?>

<DIV style="left:660PX;top:684PX;width:92PX;height:19PX;TEXT-ALIGN:RIGHT;"><span class="fc1-10">
<?= check_page($current_page_index, $total_page, number_format($r_data['dismt'],2,'.',',')) ?></span></DIV>

<DIV style="left:465PX;top:709PX;width:194PX;height:23PX;"><span class="fc1-4">จำนวนเงินหลังหักส่วนลด&nbsp;&nbsp;After Discount</span></DIV>
<?php $d_amt = $r_data['beamt'] - $r_data['dismt']; ?>

<DIV style="left:660PX;top:709PX;width:92PX;height:19PX;TEXT-ALIGN:RIGHT;"><span class="fc1-10">
<?= check_page($current_page_index, $total_page, number_format($d_amt,2,'.',',')) ?></span></DIV>

<DIV style="left:465PX;top:731PX;width:194PX;height:23PX;"><span class="fc1-4">เงินมัดจำ&nbsp;&nbsp;Deposit Payment</span></DIV>

<DIV style="left:660PX;top:753PX;width:92PX;height:19PX;TEXT-ALIGN:RIGHT;"><span class="fc1-10"></span></DIV>

<DIV style="left:465PX;top:753PX;width:194PX;height:19PX;"><span class="fc1-4">หลังหักมัดจำ&nbsp;&nbsp;After Deposit payment</span></DIV>

<DIV style="left:465PX;top:776PX;width:136PX;height:23PX;"><span class="fc1-4">ภาษีมูลค่าเพิ่ม&nbsp;&nbsp;VAT Amount</span></DIV>

<DIV style="left: 465PX; top: 799PX; width: 168px; height: 23PX;"><span class="fc1-4">ภาษีหัก ณ ที่จ่าย &nbsp;&nbsp;WHT Amount</span></DIV>

<?php
$tax_str = "";
if(!empty($r_data['taxpr']) && intval($r_data['taxpr'])>0)
	$tax_str = number_format($r_data['taxpr'],0,'.',',').'%';
else
	$tax_str = '';

$wht_str = "";
if(!empty($r_data['whtpr']) && $r_data['wht01']>0)
	$wht_str = $r_data['whtpr'];
else
	$wht_str = '';
?>
<DIV style="left:660PX;top:776PX;width:92PX;height:19PX;TEXT-ALIGN:RIGHT;"><span class="fc1-10">
<?= check_page($current_page_index, $total_page, number_format($r_data['vat01'],2,'.',',')) ?></span></DIV>

<DIV style="left:660PX;top:799PX;width:92PX;height:19PX;TEXT-ALIGN:RIGHT;"><span class="fc1-10">
<?= check_page($current_page_index, $total_page, number_format($r_data['wht01'],2,'.',',')) ?></span></DIV>

<DIV style="left:465PX;top:821PX;width:194PX;height:23PX;"><span class="fc1-2">จำนวเงินที่ต้องชำระ</span></DIV>

<DIV style="left:660PX;top:821PX;width:92PX;height:19PX;TEXT-ALIGN:RIGHT;"><span class="fc1-10">
<?= check_page($current_page_index, $total_page, number_format($r_data['netwr'],2,'.',',')) ?></span></DIV>

<!--Payment Table-->
<DIV style="left:49PX;top:865PX;width:108PX;height:19PX;TEXT-ALIGN:CENTER;"><span class="fc1-4">เงินสด&nbsp;&nbsp;Cash</span></DIV>

<DIV style="left:157PX;top:865PX;width:149PX;height:19PX;TEXT-ALIGN:CENTER;"><span class="fc1-4">ธนาคาร&nbsp;&nbsp;Bank</span></DIV>

<DIV style="left:307PX;top:865PX;width:153PX;height:19PX;TEXT-ALIGN:CENTER;"><span class="fc1-4">สาขา&nbsp;&nbsp;Branch</span></DIV>

<DIV style="left:460PX;top:865PX;width:60PX;height:19PX;TEXT-ALIGN:CENTER;"><span class="fc1-4">วันที่&nbsp;&nbsp;Date</span></DIV>

<DIV style="left:520PX;top:865PX;width:140PX;height:19PX;TEXT-ALIGN:CENTER;"><span class="fc1-4">เลขที่&nbsp;&nbsp;Cheque/Card no.</span></DIV>

<DIV style="left:660PX;top:865PX;width:93PX;height:19PX;TEXT-ALIGN:CENTER;"><span class="fc1-4">จำนวนเงิน&nbsp;&nbsp;Amount</span></DIV>

<?php
  $text_amt = $this->convert_amount->generate($r_data['netwr']);
?>
<!--Amount Text--><!--Signature Text-->
<DIV style="left:232PX;top:1041PX;width:171PX;height:19PX;TEXT-ALIGN:CENTER;"><span class="fc1-4">ผู้ส่งของ ........../............/................</span></DIV>

<DIV style="left:403PX;top:1041PX;width:166PX;height:19PX;TEXT-ALIGN:CENTER;"><span class="fc1-4">ผู้มีอำนาจลงนาม</span></DIV>

<DIV style="left:232PX;top:1059PX;width:64PX;height:19PX;TEXT-ALIGN:RIGHT;"><span class="fc1-5">Delivered by</span></DIV>

<DIV style="left:403PX;top:1059PX;width:166PX;height:19PX;TEXT-ALIGN:CENTER;"><span class="fc1-5">Authorized Signature</span></DIV>

<DIV style="left:49PX;top:1059PX;width:47PX;height:19PX;TEXT-ALIGN:RIGHT;"><span class="fc1-5">Receiver</span></DIV>

<DIV style="left:57PX;top:664PX;width:101PX;height:22PX;TEXT-ALIGN:CENTER;"><span class="fc1-4">หมายเหตุ / Remark :</span></DIV>

<DIV style="left: 75px; top: 695px; width: 374px; height: 155px;"><span class="fc1-3"><?=$r_data['txz01'];?></span></DIV>

<DIV style="left:49PX;top:1041PX;width:183PX;height:19PX;TEXT-ALIGN:CENTER;"><span class="fc1-4">ผู้รับของ ............./............../................</span></DIV>

<DIV style="left:569PX;top:1041PX;width:178PX;height:19PX;TEXT-ALIGN:CENTER;"><span class="fc1-12">ผู้รับเงิน ........../.........../.............</span></DIV>

<DIV style="left:569PX;top:1059PX;width:178PX;height:19PX;TEXT-ALIGN:CENTER;"><span class="fc1-5">Collector</span></DIV>
<BR>
<?php
		echo '</div>';
	endfor; // end page for
endfor; // end copy for
?>


</BODY></HTML>


<?php
	}
	}
   
}

?>