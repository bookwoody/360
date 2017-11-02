<?php

function createThumbnail($imageRoot, $imagefile)
{
    $thumbRoot = '../' . $imageRoot . '/thumbs';

    if (!file_exists($thumbRoot)) {
        mkdir($thumbRoot, 0777, true);
    }

    if (file_exists($thumbRoot . '/' . $imagefile)) {
        return $imageRoot . '/thumbs/' . $imagefile;
    }

    $imageFilePath = './../' . $imageRoot . '/' . $imagefile;

    $imagesize = getimagesize($imageFilePath);
    $imagewidth = $imagesize[0];
    $imageheight = $imagesize[1];
    $imagetype = $imagesize[2];

    switch ($imagetype) {
        // Bedeutung von $imagetype:
        // 1 = GIF, 2 = JPG, 3 = PNG, 4 = SWF, 5 = PSD, 6 = BMP, 7 = TIFF(intel byte order), 8 = TIFF(motorola byte order), 9 = JPC, 10 = JP2, 11 = JPX, 12 = JB2, 13 = SWC, 14 = IFF, 15 = WBMP, 16 = XBM
        case 1: // GIF
            $image = imagecreatefromgif($imageFilePath);
            break;
        case 2: // JPEG
            $image = imagecreatefromjpeg($imageFilePath);
            break;
        case 3: // PNG
            $image = imagecreatefrompng($imageFilePath);
            break;
        default:
            die('Unsupported imageformat');
    }

    // Maximalausmaße
    $maxthumbwidth = 600;
    $maxthumbheight = 350;
    // Ausmaße kopieren, wir gehen zuerst davon aus, dass das Bild schon Thumbnailgröße hat
    $thumbwidth = $imagewidth;
    $thumbheight = $imageheight;
    // Breite skalieren falls nötig
    if ($thumbwidth > $maxthumbwidth) {
        $factor = $maxthumbwidth / $thumbwidth;
        $thumbwidth *= $factor;
        $thumbheight *= $factor;
    }
    // Höhe skalieren, falls nötig
    if ($thumbheight > $maxthumbheight) {
        $factor = $maxthumbheight / $thumbheight;
        $thumbwidth *= $factor;
        $thumbheight *= $factor;
    }
    // Thumbnail erstellen
    $thumb = imagecreatetruecolor($thumbwidth, $thumbheight);

    imagecopyresampled(
        $thumb,
        $image,
        0, 0, 0, 0, // Startposition des Ausschnittes
        $thumbwidth, $thumbheight,
        $imagewidth, $imageheight
    );

    // In Datei speichern
    $thumbfile = '../' . $imageRoot . '/thumbs/' . $imagefile;
    imagepng($thumb, $thumbfile);
    imagedestroy($thumb);

    return $imageRoot . '/thumbs/' . $imagefile;
}

function getExifData($internalImagePath)
{
    $exifDataArray = array();

    $exifData = @exif_read_data($internalImagePath, 'IFD0');

    if ($exifData !== FALSE) {
        if (array_key_exists('DateTimeOriginal', $exifData)) {
            $dateTimeOriginal = $exifData['DateTimeOriginal'];
            $fbdateoriginal = str_replace(":", "-", substr($dateTimeOriginal, 0, 10));
            $fbtimeoriginal = substr($dateTimeOriginal, 10);

            $tz = new DateTimeZone("Europe/Berlin");
            $ambiguous_time = trim($fbdateoriginal) . 'T' . trim($fbtimeoriginal);

            $takenDate = new DateTime($ambiguous_time, $tz);

            $takenDateAsISO = $takenDate->format(DateTime::ISO8601);

            $exifDataArray['dateTimeOriginal'] = $takenDateAsISO;
        }

        if (array_key_exists('FileSize', $exifData)) {
            $exifDataArray['fileSize'] = $exifData['FileSize'];
        }

        if (array_key_exists('Make', $exifData)) {
            $exifDataArray['make'] = $exifData['Make'];
        }

        if (array_key_exists('Model', $exifData)) {
            $exifDataArray['model'] = $exifData['Model'];
        }

        if (array_key_exists('ExposureTime', $exifData)) {
            $exifDataArray['exposureTime'] = $exifData['ExposureTime'];
        }

        if (array_key_exists('Software', $exifData)) {
            $exifDataArray['software'] = $exifData['Software'];
        }

        if (array_key_exists('ISOSpeedRatings', $exifData)) {
            $exifDataArray['iSOSpeedRatings'] = $exifData['ISOSpeedRatings'];
        }

        if (array_key_exists('Flash', $exifData)) {
            $exifDataArray['flash'] = $exifData['Flash'];
        }

        if (array_key_exists('XResolution', $exifData)) {
            $exifDataArray['xResolution'] = $exifData['XResolution'];
        }

        if (array_key_exists('YResolution', $exifData)) {
            $exifDataArray['yResolution'] = $exifData['YResolution'];
        }

        if (array_key_exists('COMPUTED', $exifData)) {
            $computed = $exifData['COMPUTED'];

            if (array_key_exists('Width', $computed)) {
                $width = $computed['Width'];

                $exifDataArray['width'] = $width;
            }

            if (array_key_exists('Height', $computed)) {
                $height = $computed['Height'];

                $exifDataArray['height'] = $height;
            }

            if (array_key_exists('ApertureFNumber', $computed)) {
                $apertureFNumber = $computed['ApertureFNumber'];

                $exifDataArray['apertureFNumber'] = $apertureFNumber;
            }
        }

        //TODO Read GPS data
    }

    return $exifDataArray;
}