<?php
// This is the API, 2 possibilities: show the app list or show a specific app by id.
// This would normally be pulled from a database but for demo purposes, I will be hardcoding the return values.
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');


function get_app_list()
{
              $x=0;
                $array= array("code" => base64_encode($_GET['image']));
              $app_list[$x] =$array;
  return $app_list;
}
$value = get_app_list();
//return JSON array
exit(json_encode($value));
?>