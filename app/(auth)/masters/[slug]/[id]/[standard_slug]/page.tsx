/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */

import FormWizard, { FormWizardItem } from '@/components/FormWizard/FormWizard';
import AddorEditStandards from '@/components/MasterList/Standards/AddorEditStandards';
import LinkModules from '@/components/MasterList/Standards/LinkModules/LinkModules';
import LinkQuestionList from '@/components/MasterList/Standards/LinkQuestionList/LinkQuestionList';
import ViewStandards from '@/components/MasterList/Standards/ViewStandards';
import PageNotFound from '@/components/PageNotFound/PageNotFound';
import PageWrapper, {
  BreadCrumbsItem,
} from '@/components/NavBarMenu/PageWrapper/PageWrapper';
import { auth } from '@/lib/auth';
import { IMeta } from '@/lib/interface/IMeta.interface';
import { IThemes } from '@/lib/interface/IThemes.interface';
import { IStandard } from '@/lib/interface/IStandard.interface';
import { ThemeService, StandardService } from '@/lib/service';
import { convertToPascalCase } from '@/lib/utils';

type Params = {
  slug: string;
  id: string;
  standard_slug: string;
};

const getBreadcrumbs = (
  params: Params,
  standard?: IStandard,
): BreadCrumbsItem[] => {
  const base = [
    { title: 'Masters', url: '/masters/sectors', tag: true },
    {
      title: convertToPascalCase(params.slug),
      url: `/masters/${params.slug}`,
      tag: true,
    },
  ];

  // ✅ VIEW: Masters → Standards → View
  if (params.standard_slug === 'view') {
    return [
      ...base,
      {
        title: 'View',
        url: `/masters/${params.slug}/${params.id}/view`,
        tag: false,
      },
    ];
  }

  // default behavior (edit / link flows)
  if (!standard) return base;

  return [
    ...base,
    {
      title: standard.name,
      url: `/masters/${params.slug}/${params.id}`,
      tag: true,
    },
    {
      title: convertToPascalCase(params.standard_slug.replace('_', ' ')),
      url: `/masters/${params.slug}/${params.id}/${params.standard_slug}`,
      tag: false,
    },
  ];
};

const getFormWizardItems = (slug: string): FormWizardItem[] => [
  {
    title: 'Standard Info',
    selected: ['edit', 'link_themes', 'link_questions'].includes(slug),
  },
  {
    title: 'Link Themes',
    selected: ['link_themes', 'link_questions'].includes(slug),
  },
  {
    title: 'Link Questions',
    selected: slug === 'link_questions',
  },
];

export const dynamic = 'force-dynamic';

export default async function Page({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: any;
}) {
  const { unstable_noStore: noStore } = await import('next/cache');
  noStore();
  const session = await auth();
  const token: any = (session?.user as { accessToken?: string })?.accessToken;

  const filterParams = {
    page: searchParams?.page || '1',
    limit: searchParams?.limit || '30',
    search: searchParams?.search || '',
    status: searchParams?.status || '',
    sort: searchParams?.sort || '-createdAt',
    sector_name: searchParams?.sector_name || '',
    industry_name: searchParams?.industry_name || '',
    industry_id: searchParams?.industry_id || '',
    module_name: searchParams?.module_name || '',
    module_id: searchParams?.module_id || '',
    question_type: searchParams?.question_type || '',
    standard_name: searchParams?.standard_name || '',
    standard_id: searchParams?.standard_id || '',
    indicator_name: searchParams?.indicator_name || '',
    indicator_id: searchParams?.indicator_id || '',
  };

  if (params.slug !== 'standards') {
    return (
      <PageWrapper breadCrumbsItem={getBreadcrumbs(params)}>
        <PageNotFound />
      </PageWrapper>
    );
  }
  const metaList: IMeta = {
    currentCount: 1,
    currentPage: '1',
    currentLimit: '10',
    totalCount: 1,
  };

  try {
    let flag: any;
    if (params.standard_slug === 'edit') {
      flag = 'edit';
    } else if (params.standard_slug === 'view') {
      flag = 'view';
    } else if (params.standard_slug === 'link_themes') {
      flag = 'edit_link_themes';
    } else if (params.standard_slug === 'link_questions') {
      flag = 'link_questions';
    } else {
      flag = null;
    }

    const res = await StandardService.getById(
      params.id,
      token,
      flag,
      filterParams,
    );
    const standard = res.data.data as IStandard;

    const items = getFormWizardItems(params.standard_slug);
    let renderContent: JSX.Element = <div />;
    if (params.standard_slug === 'edit') {
      renderContent = (
        <AddorEditStandards actionType="Edit" currentStandard={standard} />
      );
    } else if (params.standard_slug === 'view') {
      renderContent = (
        <ViewStandards currentStandard={standard} token={token} flag={flag} />
      );
    } else if (params.standard_slug === 'link_themes') {
      renderContent = (
        <LinkModules currentStandardData={standard} token={token} flag={flag} />
      );
    } else if (params.standard_slug === 'link_questions') {
      renderContent = (
        <LinkQuestionList
          currentStandard={standard}
          token={token}
          flag={flag}
        />
      );
    } else {
      renderContent = <div />;
    }

    return (
      <PageWrapper breadCrumbsItem={getBreadcrumbs(params, standard)}>
        {params.standard_slug === 'view' ? (
          renderContent
        ) : (
          <FormWizard items={items}>{renderContent}</FormWizard>
        )}
      </PageWrapper>
    );
  } catch (error) {
    return (
      <PageWrapper breadCrumbsItem={getBreadcrumbs(params)}>
        <PageNotFound />
      </PageWrapper>
    );
  }
}
