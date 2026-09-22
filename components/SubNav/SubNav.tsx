/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mastersmenu } from '@/lib/config/root_menu';
import { FaChevronDown } from 'react-icons/fa6';

export default function SubNav({ activePage }: { activePage: string }) {
  const router = useRouter();
  const [activeMain, setActiveMain] = useState(activePage);
  const navRef = useRef<HTMLDivElement>(null);

  // ✅ Update active main tab based on subpages
  useEffect(() => {
    setActiveMain(activePage);
  }, [activePage]);

  // ✅ Handle main tab click
  const handleMainClick = (slug: string) => {
    router.push(`/masters/${slug}`);
    setActiveMain(slug);
  };

  return (
    <div className="overflow-visible mb-5" ref={navRef}>
      <ul
        className="d-flex justify-content-left align-items-center pt-3 ps-0"
        style={{ listStyle: 'none', position: 'relative' }}
      >
        {Mastersmenu.map((item) => {
          const slug = item.toLowerCase().replace(' ', '_');
          const isActive = activeMain === slug;

          return (
            <li key={item} className="me-4 position-relative">
              <div className="d-flex align-items-center">
                {/* Main button */}
                <button
                  onClick={() => handleMainClick(slug)}
                  className={`text-decoration-none edit_link_routes ${
                    isActive ? 'active' : ''
                  }`}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                  type="button"
                >
                  {item}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// import { Mastersmenu } from '@/lib/config/root_menu';
// import Select from 'react'
// import { Nav } from 'react-bootstrap';

// export default function SubNav({ activePage }: { activePage: string }) {
//   return (
//     <div>
//       <div className="overflow-scroll mb-4">
//         <ul className="d-flex  pt-3 ps-0 " style={{ maxWidth: '1400px' }}>
//           {Mastersmenu?.map((item) => (
//             <li className=" me-4 " key={item}>
//               <Nav.Link
//                 className="text-decoration-none"
//                 href={`/masters/${item?.toLocaleLowerCase()?.replace(' ', '_')}`}
//               >
//                 <span
//                   className={`edit_link_routes
//                     ${
//                       activePage
//                       === item?.toLocaleLowerCase()?.replace(' ', '_')
//                         ? 'active'
//                         : ''
//                     }`}
//                 >
//                   {item}
//                 </span>
//               </Nav.Link>
//             </li>
//           ))}
//         </ul>

//       </div>
//     </div>
//   );
// }
