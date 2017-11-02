import NavbarTemplate from '../template/navbar.njk';

export default class Navbar {
    render()
    {
        $('.navbar').append(NavbarTemplate.render());
    }
}