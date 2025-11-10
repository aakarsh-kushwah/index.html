import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../navbar/header';
import ReferenceLinkModal from './ReferenceLinkModal';
import ReferenceLinkCard from './ReferenceLinkCard';
import InfoCard from '../cards/HomePageInfoCard';
import ProductDetails from '../product/product';
import BuyProduct from './BuyProductModel';

import axios from 'axios';
import BrandSectionHome from './BrandSectionHome'; 

function HomePage() {
  const [showReferenceLinkModal, setShowReferenceLinkModal] = useState(false);
  const [showBuyProductModal, setShowBuyProductModal] = useState(false);
  const [userStatus, setUserStatus] = useState(null);
  const [referenceLink, setReferenceLink] = useState('');

  const handleCloseReferenceLinkModal = () => setShowReferenceLinkModal(false);
  const handleCloseBuyProductModal = () => setShowBuyProductModal(false);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found. User might not be logged in.');
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_PROTOCOL}/api/user/user-profile-details`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userProfile = response.data.data;
      setUserStatus(userProfile.status);
      localStorage.setItem(
        'userProfile',
        JSON.stringify({
          first_name: userProfile.first_name,
          unique_id: userProfile.unique_id,
          phone_number: userProfile.phone_number,
          email: userProfile.email,
          status: userProfile.status,
          level: userProfile.level,
          childs: userProfile.childs,
          Balance: userProfile.Balance,
        })
      );
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchReferenceLink = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found. User might not be logged in.');
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_PROTOCOL}/api/user/referral-link`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReferenceLink(response.data.data);
    } catch (error) {
      console.error('Error fetching referral link:', error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (userStatus === 'active') {
      fetchReferenceLink();
      setShowReferenceLinkModal(true);
    } else if (userStatus === 'pending') {
      setShowBuyProductModal(true);
    }
  }, [userStatus]);

  return (
    <div>
      <Header />

     

      <div className="container mt-5">
        <InfoCard />
      </div>
 {/* BrandSectionHome UI yaha add kiya */}
      <div className="mt-4 mb-5">
        <BrandSectionHome />
      </div>
      {userStatus === 'active' && (
        <>
          <ReferenceLinkModal
            showReferenceLink={showReferenceLinkModal}
            handleCloseReferenceLink={handleCloseReferenceLinkModal}
            referenceLink={referenceLink}
          />
          <ReferenceLinkCard referenceLink={referenceLink} />
        </>
      )}

      {userStatus === 'pending' && (
        <BuyProduct
          showBuyProduct={showBuyProductModal}
          handleCloseBuyProduct={handleCloseBuyProductModal}
        />
      )}

      <ProductDetails />

    </div>
  );
}

export default HomePage;
