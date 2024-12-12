import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Header from "../Header/Header";
import { Card } from "flowbite-react";
import loyalty from "../../assets/loyalty.jpg";
import referral from "../../assets/referral.jpg";
import randomizer from "../../assets/randomizer.jpg";
import { getContact } from "../../utlis/getContact";

const Menu = () => {
  const location = useLocation();
  const { phone } = location.state || {};
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactData = async () => {
      if (!phone) {
        console.error("Phone number not provided!");
        setLoading(false);
        return;
      }

      try {
        const contactResponse = await getContact({ phone_number: phone });
        setContactData(contactResponse);
      } catch (error) {
        console.error("Failed to fetch contact data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactData();
  }, [phone]);

  const renderCard = (imgSrc, altText, title, link, state = {}) => (
    <Link to={link} state={state}>
      <Card className="h-full">
        <img
          src={imgSrc}
          alt={altText}
          className="h-48 w-full rounded-t-lg object-cover"
        />
        <h5 className="mt-4 text-center text-2xl font-bold tracking-tight text-primary">
          {title}
        </h5>
      </Card>
    </Link>
  );

  return (
    <div className="min-h-screen bg-white font-jost">
      {/* Header Section */}
      <Header />

      {/* Main Content Section */}
      <main>
        {/* Title Section */}
        <div className="flex flex-col items-center justify-center bg-primary py-10">
          <h1 className="text-3xl font-bold text-white lg:text-5xl">
            Explore Our Programs
          </h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <p>Loading...</p>
          </div>
        ) : (
          <div className="container mx-auto py-10">
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {renderCard(
                loyalty,
                "Loyalty Rewards",
                "Loyalty Rewards",
                "/welcome",
                { phone },
              )}
              {renderCard(
                referral,
                "Referral Program",
                "P2P Referral Program",
                "/",
              )}
              {renderCard(
                randomizer,
                "Randomizer Program",
                "Spin the Wheel",
                "/",
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Menu;
