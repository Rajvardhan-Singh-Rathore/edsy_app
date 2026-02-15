
import React from 'react';
import { Screen } from '../types';

interface Props {
  onNavigate: (screen: Screen) => void;
}

const TermsScreen: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col h-full bg-background-dark text-white overflow-hidden relative">
      <header className="px-6 pt-12 pb-4">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => onNavigate('HOME')}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-zinc-800 hover:bg-zinc-900 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <div className="text-[10px] tracking-widest font-bold opacity-60 uppercase">.edsy</div>
          <div className="w-10"></div>
        </div>
        <h1 className="text-5xl font-light leading-tight tracking-tight mb-2">
          Terms & <br/>
          <span className="font-medium">Conditions</span>
        </h1>
        <p className="text-slate-400 text-sm mt-4">Please read our terms carefully.</p>
      </header>

      <main className="flex-1 px-6 pt-8 overflow-y-auto no-scrollbar pb-32">
        <div className="bg-zinc-900/50 border border-white/5 rounded-[32px] p-8">
          <div className="prose prose-invert prose-sm max-w-none text-slate-300 space-y-4">
            <p>
              For the purpose of these Terms and Conditions, The term "you", “your”, "user", “visitor” shall mean any natural or legal person who is visiting our website and/or agreed to purchase from us.
            </p>
            
            <p>
              Your use of the website and/or purchase from us are governed by following Terms and Conditions:
            </p>

            <ul className="list-disc pl-5 space-y-2">
              <li>The content of the pages of this website is subject to change without notice.</li>
              <li>Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this website for any particular purpose.</li>
              <li>You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.</li>
              <li>Your use of any information or materials on our website and/or product pages is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through our website and/or product pages meet your specific requirements.</li>
              <li>Our website contains material which is owned by or licensed to us. This material includes, but are not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.</li>
              <li>All trademarks reproduced in our website which are not the property of, or licensed to, the operator are acknowledged on the website.</li>
              <li>From time to time our website may also include links to other websites. These links are provided for your convenience to provide further information.</li>
              <li>You may not create a link to our website from another website or document without RAJ VARDHAN SINGH RATHORE’s prior written consent.</li>
              <li>Any dispute arising out of use of our website and/or purchase with us and/or any engagement with us is subject to the laws of India .</li>
              <li>We, shall be under no liability whatsoever in respect of any loss or damage arising directly or indirectly out of the decline of authorization for any Transaction, on Account of the Cardholder having exceeded the preset limit mutually agreed by us with our acquiring bank from time to time.</li>
            </ul>
          </div>
        </div>
      </main>

      <footer className="p-8 text-center bg-background-dark/80 backdrop-blur-md absolute bottom-0 left-0 right-0 border-t border-white/5">
        <p className="text-[10px] text-zinc-600 uppercase tracking-[0.2em]">© 2026 RAJ VARDHAN SINGH RATHORE</p>
      </footer>
    </div>
  );
};

export default TermsScreen;
