/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-magic-numbers */
/* eslint-disable max-len */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Html from 'SourceComponent/Html';

import './ShowMoreOrLessContent.style';

/** @namespace Seedsman/Component/ShowMoreOrLessContent/Component */
export class ShowMoreOrLessContentComponent extends PureComponent {
    static propTypes = {
        description: PropTypes.string.isRequired,
        expandButtonClick: PropTypes.func.isRequired,
        buttonClick: PropTypes.string.isRequired,
        isPdpPage: PropTypes.string.isRequired
    };

    renderShowButton() {
        const { expandButtonClick, buttonClick, isPdpPage } = this.props;

        return (
            <div
              block="ExpandableContentCategoryDescription"
              elem="knowMoreBtnWrapper"
            >
                <button
                  block="ExpandableContentCategoryDescription"
                  elem="knowMoreBtn"
                  onClick={ expandButtonClick }
                >
                    { isPdpPage
                        ? (buttonClick ? 'Less Info' : 'More Info')
                        : (buttonClick ? 'read Less' : 'read More') }
                </button>
            </div>
        );
    }

    render() {
        const { description = '', buttonClick, isPdpPage } = this.props;

        if (!description) {
            return null;
        }

        if (isPdpPage) {
            return (
                <>
                    <div
                      block="ExpandableContentCategoryDescription"
                      elem="description"
                    >
                        { buttonClick ? (
                            <Html content={ description } />
                        ) : (
                            <>
                                { description?.length - 200 > 100 ? (
                                    <Html
                                      content={ `${description.substring(0, 200)}${
                                          description?.length > 200
                                              ? '....'
                                              : ''
                                      }` }
                                    />
                                ) : (
                                    <Html content={ description } />
                                ) }
                            </>
                        ) }
                    </div>
                    { description.length > 200 && description?.length - 200 > 100
                        ? this.renderShowButton()
                        : null }
                </>
            );
        }

        return (
            <>
                <div
                  block="ExpandableContentCategoryDescription"
                  elem="description"
                >
                    { buttonClick ? (
                        <Html content={ description } />
                    ) : (
                        <>
                            { description?.length - 500 > 100 ? (
                                <Html
                                  content={ `${description.substring(0, 500)}${
                                      description?.length > 500
                                          ? '....'
                                          : ''
                                  }` }
                                />
                            ) : (
                                <Html content={ description } />
                            ) }
                        </>
                    ) }
                </div>
                { description.length > 500 && description?.length - 500 > 100
                    ? this.renderShowButton()
                    : null }
            </>
        );
    }
}

export default ShowMoreOrLessContentComponent;
