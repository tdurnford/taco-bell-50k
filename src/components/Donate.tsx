import logo from '../images/achilles-logo.png';

export const Donate = () => {
    return (
      <section className="Donate">
          <br></br>
        <h2>Charity Partner</h2>
        <p>
          Please consider donating to our official charity partner, <a href="https://give.achillesinternational.org/campaign/achilles-denver/c384648" 
          target="_blank" rel="noreferrer"> Achilles International Denver Chapter!</a> All proceeds go directly to disabled runners in the Denver area for race entry fees, running shoes, 
          and running-related equipment. So far, two blind runners are Taco Bell 50k Survivors!!
        </p>

        <img src={logo} alt="Logo for Achilles International Denver" style={{ width: '200px', height: '150px' }} />
  
        <p>
            This event is not sponsored by or endorsed by Taco Bell Corp., so be cool.
        </p>
  
      </section>
    );
  };
  