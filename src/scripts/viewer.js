import URI from 'urijs';
import 'photo-sphere-viewer-css';
import '../styles/viewer.css';
import './common-imports.js';
import loading_img from '../images/photosphere-logo.gif';
import PhotoSphereViewer from 'photo-sphere-viewer';
import Navbar from './navbar.js';

let navbar = new Navbar();
navbar.render();

let uri = new URI();
let query = uri.search(true);

if (query.url) {
    let photosphereDiv = document.getElementById('photosphere');
    photosphereDiv.style.width = '100%';
    photosphereDiv.style.height = '100%';

    let PSV = new PhotoSphereViewer({
        container: 'photosphere',
        panorama: query.url,
        loading_img: loading_img,
        anim_speed: '2rpm',
        fisheye: true,
        move_speed: 5,
        time_anim: true,
        gyroscope: true,
        navbar: [
            'autorotate',
            'zoom',
            'markers',
            'spacer-1',
            'gyroscope',
            'fullscreen'
        ]
    });

    PSV.getNavbarButton('markers').hide();
}
else {
    //TODO Error
}