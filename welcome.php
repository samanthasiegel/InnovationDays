<?php

echo 'Hello ' . htmlspecialchars($_GET["firstName"]) . '!';

$params = explode(",", $argv[1]);
echo $params[0] ." - " . $params[1] . " - " . $params[2];

echo "HELLO SAMMI";

error_reporting(E_ALL);
date_default_timezone_set('Europe/London');

require_once "Classes/PHPExcel/IOFactory.php";
require_once "Classes/PHPExcel.php";

//$objPHPExcel = new PHPExcel();
$objPHPExcel = PHPExcel_IOFactory::createReader('Excel2007');
$objPHPExcel = $objPHPExcel->load('ExpenseCopy.xlsx');
$objPHPExcel->setActiveSheetIndex(0);

// $objPHPExcel->getActiveSheet()->setCellValue('C13', $params[1]);

/*
* B - Date
* C - Location/explanation
* E - Airfare
* F - Lodging
* G - Meals
* H - Miles (auto)
*/


// $objPHPExcel->getActiveSheet()->setCellValue('D4', 'Jamal Pace');
// $objPHPExcel->getActiveSheet()->setCellValue('J4', '123-456-7890');
// $objPHPExcel->getActiveSheet()->setCellValue('D5', '123 Lit Lane');
// $objPHPExcel->getActiveSheet()->setCellValue('J5', 'jamal_pace@intuit.com');

// dates
$objPHPExcel->getActiveSheet()->setCellValue('B13', $params[0]);
$objPHPExcel->getActiveSheet()->setCellValue('B14', $params[1]);
$objPHPExcel->getActiveSheet()->setCellValue('B15', $params[2]);
$objPHPExcel->getActiveSheet()->setCellValue('B16', $params[3]);
// $objPHPExcel->getActiveSheet()->setCellValue('B17', $params[1]);

// location reasons
$objPHPExcel->getActiveSheet()->setCellValue('C13', $params[4]);
$objPHPExcel->getActiveSheet()->setCellValue('C14', $params[5]);
$objPHPExcel->getActiveSheet()->setCellValue('C15', $params[6]);
$objPHPExcel->getActiveSheet()->setCellValue('C16', $params[7]);
// $objPHPExcel->getActiveSheet()->setCellValue('C17', $params[1]);

// airfare
$objPHPExcel->getActiveSheet()->setCellValue('E13', $params[8]);
$objPHPExcel->getActiveSheet()->setCellValue('E14', $params[9]);
$objPHPExcel->getActiveSheet()->setCellValue('E15', $params[10]);
$objPHPExcel->getActiveSheet()->setCellValue('E16', $params[11]);
// $objPHPExcel->getActiveSheet()->setCellValue('E17', $params[1]);

// lodging
$objPHPExcel->getActiveSheet()->setCellValue('F13', $params[12]);
$objPHPExcel->getActiveSheet()->setCellValue('F14', $params[13]);
$objPHPExcel->getActiveSheet()->setCellValue('F15', $params[14]);
$objPHPExcel->getActiveSheet()->setCellValue('F16', $params[15]);
// $objPHPExcel->getActiveSheet()->setCellValue('F17', $params[1]);

// meals per diem
$objPHPExcel->getActiveSheet()->setCellValue('G13', $params[16]);
$objPHPExcel->getActiveSheet()->setCellValue('G14', $params[17]);
$objPHPExcel->getActiveSheet()->setCellValue('G15', $params[18]);
$objPHPExcel->getActiveSheet()->setCellValue('G16', $params[19]);
// $objPHPExcel->getActiveSheet()->setCellValue('G17', $params[1]);

// miles
$objPHPExcel->getActiveSheet()->setCellValue('H13', $params[20]);
$objPHPExcel->getActiveSheet()->setCellValue('H14', $params[21]);
$objPHPExcel->getActiveSheet()->setCellValue('H15', $params[22]);
$objPHPExcel->getActiveSheet()->setCellValue('H16', $params[23]);

// personal info
$objPHPExcel->getActiveSheet()->setCellValue('D4', $params[24]);
$objPHPExcel->getActiveSheet()->setCellValue('J4', $params[25]);
$objPHPExcel->getActiveSheet()->setCellValue('D5', $params[26]);
$objPHPExcel->getActiveSheet()->setCellValue('J5', $params[27]);
//objPHPExcel->getActiveSheet()->setCellValue('H17', $params[1]);

//$objWriter = new PHPExcel_Writer_Excel2007($objPHPExcel);
$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
$objWriter->save('ExpenseCopy1.xlsx');

?>