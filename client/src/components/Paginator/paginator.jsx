import React from 'react';

const renderPageButtons = (current, max, goToPage) => {
    const linksNumber = 7;
    const linksDepth = Math.floor(linksNumber / 2);
    let start = current - linksDepth;
    let end = current + linksDepth;
    if (max >= linksNumber){
        if (start<=1)  {
            start =  1;
            end = start + linksNumber - 1;
        }
        if (end > max) {
            end = max;
            start = max - linksNumber + 1;
        }
    } else {
        start = 1;
        end = max;
    }
    let btns = [];
    for (let i = start; i <= end; i++){
        btns.push(
            <li className={`page-item ${i === current ? 'active' : ''}`}
                key={i}
            >
                <a className="page-link"
                   href="#"
                   onClick={e => {
                       e.preventDefault();
                       goToPage(i);
                   }}
                >{i}</a>
            </li>
        )
    }
    return btns
};

export const Paginator = ({isShown, totalPages, currentPage, goToPage}) => {
    if (isShown){
        return (
            <nav>
                <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}
                    >
                        <a className="page-link"
                           href="#"
                           onClick={e => {
                               e.preventDefault();
                               if (currentPage !== 1){
                                   goToPage(1);
                               }
                           }}
                        >First</a>
                    </li>
                    {renderPageButtons(currentPage, totalPages, goToPage).map(link => link)}
                    <li className={`page-item ${totalPages === currentPage ? 'disabled' : ''}`}
                    >
                        <a className="page-link"
                           href="#"
                           onClick={e => {
                               e.preventDefault();
                               if (currentPage !== totalPages){
                                   goToPage(totalPages);
                               }
                           }}
                        >Last</a>
                    </li>
                </ul>
            </nav>
        )
    } else {
        return null
    }

};
