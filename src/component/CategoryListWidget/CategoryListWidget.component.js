/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-conditional */
/* eslint-disable react/prop-types */
import { PureComponent } from 'react';

import Html from 'Component/Html';
import Image from 'Component/Image';
import Link from 'Component/Link';
import ShowMoreOrLessContent from 'Component/ShowMoreOrLessContent';
import TextPlaceholder from 'Component/TextPlaceholder';

import ContentWrapperComponent from '../ContentWrapper/ContentWrapper.component';

import './CategoryListWidget.style';
/** @namespace Seedsman/Component/CategoryListWidget/Component */
export class CategoryListWidgetComponent extends PureComponent {
    renderCategoryTitle(name) {
        return (

            <h1 block="CategoryListWidget" elem="categoryTitle">{ name }</h1>

        );
    }

    renderCategoryDescription(description) {
        return (
            <div block="CategoryListWidget" elem="categoryContent">
                <ShowMoreOrLessContent
                  description={ description }
                />

            </div>
        );
    }

    renderSubcategory(subCategoryItem) {
        if (subCategoryItem?.show_in_widget === 1) {
            return (
            <div block="CategoryListWidget" elem="subCategoryItem">
                <div block="CategoryListWidget" elem="subCategoryItemContent">
                { this.renderSubCategoryIcon(subCategoryItem?.category_icon) }
                { this.renderSubCategoryName(subCategoryItem?.name) }
                { /* <div block="CategoryListWidget" elem="subCategoryDescriptionContent">
                    { this.renderSubCategoryDescription(subCategoryItem?.description) }
                </div> */ }

                { this.renderShopNowButton(subCategoryItem?.url) }
                </div>
            </div>
            );
        }

        return null;
    }

    renderSubCategoryDescription(description) {
        const { isLoading } = this.props;
        if (isLoading) {
            return (<TextPlaceholder length="medium" />);
        }

        return (

            <Html content={ description } />

        );
    }

    renderShopNowButton(url) {
        return (
                 <Link
                   to={ url }
                   block="Button CategoryListWidget"
                   elem="ShopNow"
                   id="ShopNow"
                 >
                     <span block="CategoryListWidget" elem="ShopNowButtonText">
                    Shop Now
                     </span>
                 </Link>
        );
    }

    renderSubCategoryIcon(icon) {
        return (
            <div block="CategoryListWidget" elem="subCategoryItemIcon">
                   <Image
                     mix={ { block: 'CategoryListWidget', elem: 'FigureImage' } }
                     ratio="custom"
                     src={ icon }
                     isPlaceholder={ !icon }
                   />

            </div>
        );
    }

    renderCategoryCardPLaceholder() {
        const { numberOfPlaceholders } = this.props;

        return Array.from({ length: numberOfPlaceholders }, (_, i) => (

                <div className="CategoryListWidget-subCategoryItemContent" key={ i }>
                { this.renderSubCategoryIcon() }
                { this.renderSubCategoryName() }
              <div className="CategoryListWidget-subCategoryDescriptionContent">
              { this.renderSubCategoryDescription() }
              </div>

                </div>

        ));
    }

    renderSubCategoryName(name) {
        const { isLoading } = this.props;
        if (isLoading) {
            return (<TextPlaceholder />);
        }

        return (
            <div block="CategoryListWidget" elem="subCategoryItemTitle">
                { name }
            </div>
        );
    }

    renderCategoryDetails(children) {
        return (
            children?.map((subCategory) => {
                const catSubCategory = subCategory?.children;
                // eslint-disable-next-line array-callback-return
                return (catSubCategory?.map((subCategoryItem) => this.renderSubcategory(subCategoryItem)));
            }));

        // children?.map((subCategory) => this.renderSubcategory(subCategory)));
    }

    render() {
        const { category, isLoading } = this.props;
        return (
            <ContentWrapperComponent>
                <div block="CategoryListWidget" elem="Header">
                    { isLoading ? <TextPlaceholder length="medium" /> : this.renderCategoryTitle(category?.name) }
                </div>

                { this.renderCategoryDescription(category?.description) }
                <div block="CategoryListWidget" elem="SubCategory">

                { isLoading ? this.renderCategoryCardPLaceholder()
                    : this.renderCategoryDetails(category?.children) }
                </div>
            </ContentWrapperComponent>

        );
    }
}

export default CategoryListWidgetComponent;
