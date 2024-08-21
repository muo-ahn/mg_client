// src/components/shared/Footer.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/footer.css';

export function Footer() {
  const [showBusinessInfo, setShowBusinessInfo] = useState(false);

  const toggleBusinessInfo = () => {
    setShowBusinessInfo(!showBusinessInfo);
  };

  return (
    <footer className="footer">
      <div className="container mx-auto">
        <div className="md:flex-row md:justify-between mb-4">
          <div className="contact-info">
             <h5>CONTACT US</h5>
            <p className="text-sm">고객센터</p>
            <p className="text-sm">010-2780-7571</p>
          </div>
          <div className="business-info">
            <h5
              className="font-bold mb-2 cursor-pointer"
              onClick={toggleBusinessInfo}
            >
              사업자정보 {showBusinessInfo ? '▲' : '▼'}
            </h5>
            {showBusinessInfo && (
              <div>
                <p className="text-sm">법인명 : 메다카갤러리 &nbsp; 대표자 : 백우현</p>
                <p className="text-sm">사업자등록번호 : 173-60-00715</p>
                <p className="text-sm">통신판매업 신고 : 제 2023-대전동구-0040 호 &nbsp; 팩스 :</p>
                <p className="text-sm">주소 : 34625 대전광역시 동구 대전천동로 574 (중동) 3층 메다카갤러리</p>
                <p className="text-sm">개인정보관리책임 : SNR 백구(blog109@naver.com)</p>
              </div>
            )}
          </div>
          <div className="nav-links flex flex-col items-center md:items-start">
            <nav className="flex flex-col md:flex-row gap-4 text-sm mb-4">
              <Link to="/company" className="hover:underline">회사소개</Link>
              <Link to="/agreements" className="hover:underline">이용약관</Link>
              <Link to="/privacy" className="hover:underline">개인정보취급방침</Link>
              <Link to="/guide" className="hover:underline">이용안내</Link>
            </nav>
          </div>
        </div>
        <div className="border-top pt-4">
          <p className="text-sm text-center">&copy; 2024 메다카갤러리. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
