import React from 'react';
import {Link} from 'react-router-dom';

const getPagesTotalNumber = (totalItems, itemsPerPage) => Math.ceil(totalItems/itemsPerPage);

const getPageNumberForItem = (itemIndex, itemsPerPage) => Math.floor(itemIndex/itemsPerPage) + 1;

const renderPageButtons = (currentPage, lastPageNumber, urlPrefix) => {
    const linksNumber = 5;
    const linksDepth = Math.floor(linksNumber / 2);
    let start = currentPage - linksDepth;
    let end = currentPage + linksDepth;
    if (lastPageNumber >= linksNumber){
        if (start<=1)  {
            start =  1;
            end = start + linksNumber - 1;
        }
        if (end > lastPageNumber) {
            end = lastPageNumber;
            start = lastPageNumber - linksNumber + 1;
        }
    } else {
        start = 1;
        end = lastPageNumber;
    }
    let btns = [];
    for (let i = start; i <= end; i++){
        btns.push(
            <li className={`page-item ${i === currentPage ? 'active' : ''}`}
                key={i}
            >
                <Link className="page-link"
                      to={urlPrefix + '?page=' + String(i)}
                >{i}</Link>
            </li>
        )
    }
    return btns
};

export const getDisplayedItems = (items, pageNumber, itemsPerPage) => {
    let startIndex = pageNumber*itemsPerPage - itemsPerPage;
    if (Array.isArray(items)){
        if (startIndex >= items.length) {
            return items.slice(-itemsPerPage)
        } else {
            return items.slice(startIndex, startIndex + itemsPerPage)
        }
    }

    if (typeof items === 'object'){
        let keys = Object.keys(items);
        let displayedLocations = {};
        if (startIndex >= keys.length) {
            keys.slice(-itemsPerPage).forEach(key => {
                displayedLocations[key] = {};
                Object.assign(displayedLocations[key], items[key])
            })
        } else {
            keys.slice(startIndex, startIndex + itemsPerPage).forEach(key => {
                displayedLocations[key] = {};
                Object.assign(displayedLocations[key], items[key])
            })
        }
        return displayedLocations;
    }

    return [];

};

export const Paginator = ({
                              isShown,
                              itemsPerPage,
                              currentElementIndex,
                              currentPage,
                              totalItems,
                              urlPrefix
                          }) => {
    if (isShown){
        const pagesTotalNumber = getPagesTotalNumber(totalItems, itemsPerPage);
        currentPage = parseInt(currentPage, 10) ;
        currentPage = (currentPage <= pagesTotalNumber) ? currentPage : pagesTotalNumber;
        if(currentElementIndex) {
            currentPage = getPageNumberForItem(currentElementIndex, itemsPerPage);
        }

        return (
            <nav>
                <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}
                    >
                        <Link className="page-link"
                           to={urlPrefix + '?page=' + String(1)}
                           onClick={e => {
                               if (currentPage === 1){
                                   e.preventDefault();
                               }
                           }}
                        >First</Link>
                    </li>
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <Link className="page-link"
                           to={urlPrefix + '?page=' + String(currentPage - 1)}
                           aria-label="Previous"
                           onClick={e => {
                               if (currentPage === 1){
                                   e.preventDefault();
                               }
                           }}
                        >
                            <span aria-hidden="true">&laquo;</span>
                            <span className="sr-only">Previous</span>
                        </Link>
                    </li>

                    {renderPageButtons(currentPage, pagesTotalNumber, urlPrefix).map(link => link)}

                    <li className={`page-item ${pagesTotalNumber === currentPage ? 'disabled' : ''}`}>
                        <Link className="page-link"
                              to={urlPrefix + '?page=' + String(currentPage + 1)}
                           aria-label="Next"
                           onClick={e => {
                               if (currentPage === pagesTotalNumber){
                                   e.preventDefault();
                               }
                           }}
                        >
                            <span aria-hidden="true">&raquo;</span>
                            <span className="sr-only">Next</span>
                        </Link>
                    </li>
                    <li className={`page-item ${pagesTotalNumber === currentPage ? 'disabled' : ''}`}
                    >
                        <Link className="page-link"
                              to={urlPrefix + '?page=' + String(pagesTotalNumber)}
                           onClick={e => {
                               if (currentPage === pagesTotalNumber){
                                   e.preventDefault();
                               }
                           }}
                        >Last</Link>
                    </li>
                </ul>
            </nav>
        )
    } else {
        return null
    }

};
