import { Grid } from "@mui/material"
import '../App.css'
const Footer = () => {
    return (
            <Grid className="footerWrapper">
                <Grid container spacing={3} className="footer">
                    <Grid size={1} className="footerBox">
                        <h4>Support</h4>
                        <a href="#">Help Center</a>
                        <a href="#">Get help with a safety issue</a>
                        <a href="#">AirCover</a>
                        <a href="#">Travel insurance</a>
                        <a href="#">Anti-discrimination</a>
                        <a href="#">Disability support</a>
                        <a href="#">Cancellation options</a>
                        <a href="#">Report neighborhood concern</a>
                    </Grid>
                    <Grid size={1} className="footerBox">
                        <h4>Hosting</h4>
                        <a href="#">Airbnb your home</a>
                        <a href="#">Airbnb your experience</a>
                        <a href="#">Airbnb your service</a>
                        <a href="#">AirCover for Hosts</a>
                        <a href="#">Help Center</a>
                        <a href="#">Hosting resources</a>
                        <a href="#">Community forum</a>
                        <a href="#">Hosting responsibly</a>
                        <a href="#">Airbnb-friendly apartments</a>
                        <a href="#">Join a free hosting class</a>
                        <a href="#">Find a co‑host</a>
                        <a href="#">Refer a host</a>
                    </Grid>
                    <Grid size={1} className="footerBox">
                        <h4>Airbnb</h4>
                        <a href="#">2026 Summer Release</a>
                        <a href="#">Newsroom</a>
                        <a href="#">Careers</a>
                        <a href="#">Investors</a>
                        <a href="#">Gift cards</a>
                        <a href="#">Airbnb.org emergency stays</a>
                    </Grid>
                </Grid><br /><br /><br />
                <hr />
                <Grid container spacing={2} className="footerBottom">
                    <Grid ><span>© 2026 Airbnb, Inc. · <a href="#">Privacy</a> · <a href="#">Terms</a> · <a href="#">Your  Privacy  Choices</a></span></Grid>
                    <Grid className="footerBottomRight"><span><span><ion-icon name="globe-outline"></ion-icon></span> English (US) $ USD </span>
                        <span>  <ion-icon name="logo-facebook"></ion-icon></span>
                        <span>  <ion-icon name="logo-x"></ion-icon></span>
                        <span>  <ion-icon name="logo-instagram"></ion-icon></span>

                    </Grid>
                </Grid>
            </Grid>
    )
}

export default Footer