<?php

$imageRoot = 'public';

include 'imageUtils.php';

// Get the HTTP method
$method = $_SERVER['REQUEST_METHOD'];

$return_array = array();

if ($handle = opendir('./../' . $imageRoot)) {
    // This is the correct way to loop over the directory.
    while (false !== ($entry = readdir($handle))) {
        if ($entry != "." && $entry != "..") {
            // Get the file info of the entry
            $file_info = pathinfo($entry);
            if (isset ($file_info['extension'])) {

                $fileExtension = $file_info['extension'];
                $fileName = $file_info['filename'];

                // Check the file extension
                if (strtolower($fileExtension) == 'jpg' || strtolower($fileExtension) == 'png') {

                    $imagePath = $imageRoot . '/' . $entry;
                    $thumbfile = createThumbnail($imageRoot, $entry);

                    $internalImagePath = '../' . $imageRoot . '/'. $entry;

                    $exifData = getExifData($internalImagePath);

                    $array_entry = array('name' => $fileName, 'imagePath' => $imagePath, 'thumbPath' => $thumbfile, 'exifData' => $exifData);

                    $return_array[] = $array_entry;
                }
            }
        }
    }

    closedir($handle);
}

if (count($return_array) == 0) {
    http_response_code(404);
} elseif ($method == 'GET') {
    echo json_encode($return_array);
}
