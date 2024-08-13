import logo from '../images/logo.png';

export const Donate = () => {
    return (
      <section className="Donate">
          <br></br>
        <h3>
          Please consider donating to our official charity partner,  Achilles International Denver Chapter! All proceeds go directly to disabled runners in the Denver area for race entry fees, running shoes, 
          and running-related equipment. So far, two blind runners are Taco Bell 50k Survivors!!
        </h3>

        <img src={logo} alt="Logo" style={{ width: '200px', height: '150px' }} />
  
        <p>
            This event is not sponsored by or endorsed by Taco Bell Corp., so be cool.
        </p>
  
      </section>
    );
  };
  