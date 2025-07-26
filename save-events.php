<?php
// save-events.php
// Slaat de events op in events.json
$data = file_get_contents('php://input');
file_put_contents('events.json', $data);
?>
