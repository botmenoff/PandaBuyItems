// components/NavBar.js
import "../../styles/navbar.css"
import { NavBarItem } from './navbarItem'

export function NavBar() {
    return (
        <nav className="navBar">
            <NavBarItem />
            <NavBarItem text="Recomended" />
            <NavBarItem text="Shoes" />
        </nav>
    );
}
