/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable no-case-declarations */
/* eslint-disable no-inner-declarations */
/* eslint-disable react/no-unstable-nested-components */

// "use client";

import Avatar from '@/components/Avatar/Avatar';
import Badge from '@/components/Badge/Badge';
import Filter from '@/components/Filter/Filter';
import InviteButton from '@/components/InviteButton/InviteButton';
import ActActionDowpDown from '@/components/MasterList/Act/ActActionDowpDown';
import ActList from '@/components/MasterList/Act/ActList';
import ActWrapper from '@/components/MasterList/Act/ActWrapper';
import CategoryActionDowpDown from '@/components/MasterList/Category/CategoryActionDowpDown';
import CategoryList from '@/components/MasterList/Category/CategoryList';
import CategoryWrapper from '@/components/MasterList/Category/CategoryWrapper';
import IndicatorsActionDowpDown from '@/components/MasterList/Indicators/IndicatorsActionDowpDown';
import IndicatorsList from '@/components/MasterList/Indicators/IndicatorsList';
import IndicatorsWrapper from '@/components/MasterList/Indicators/IndicatorsWrapper';
import IndustryList from '@/components/MasterList/Industries/IndustriesList';
import IndustriesWrapper from '@/components/MasterList/Industries/IndustriesWrapper';
import IndustryActionDowpDown from '@/components/MasterList/Industries/IndustryActionDowpDown';
import MasterFilter from '@/components/MasterList/MasterFilter/MasterFilter';
import ModulesActionDowpDown from '@/components/MasterList/Modules/ModulesActionDowpDown';
import ModulesList from '@/components/MasterList/Modules/ModulesList';
import ModulesWrapper from '@/components/MasterList/Modules/ModulesWrapper';
import QuestionsList from '@/components/MasterList/Question/IndicatorsList';
import QuestionsActionDowpDown from '@/components/MasterList/Question/QuestionsActionDowpDown';
import QuestionsWrapper from '@/components/MasterList/Question/QuestionsWrapper';
import MobileFilter from '@/components/MasterList/Sector/MobileFilter';
import SectorActionDowpDown from '@/components/MasterList/Sector/SectorActionDowpDown';
import SectorList from '@/components/MasterList/Sector/SectorList';
import SectorWrapper from '@/components/MasterList/Sector/SectorWrapper';
import SectionActionDowpDown from '@/components/MasterList/Section/SectionActionDowpDown';
import SectionList from '@/components/MasterList/Section/SectionList';
import SectionWrapper from '@/components/MasterList/Section/SectionWrapper';
import StandardsActionDowpDown from '@/components/MasterList/Standards/StandardsActionDowpDown';
import StandardsList from '@/components/MasterList/Standards/StandardsList';
import StandardsWrapper from '@/components/MasterList/Standards/StandardsWrapper';
import PageNotFound from '@/components/PageNotFound/PageNotFound';
import PageWrapper from '@/components/NavBarMenu/PageWrapper/PageWrapper';
import Pagination from '@/components/Pagination/Pagination';
import RolesAndAccess from '@/components/RolesAndAccess/RolesAndAccess';
import ThemesIndustriesDropDown from '@/components/MasterList/ThemesIndustries/ThemesIndustriesDropdown';
import ThemesIndustriesList from '@/components/MasterList/ThemesIndustries/ThemesIndustryList';
import ThemesIndustryWrapper from '@/components/MasterList/ThemesIndustries/ThemesIndustryWrapper';
import FileRepoDropdown from '@/components/MasterList/FileRepo/FileRepoDropdown';
import FileRepoList from '@/components/MasterList/FileRepo/FileRepoList';
import FileRepoWrapper from '@/components/MasterList/FileRepo/FileRepoWrapper';
import ComplianceRequirementActionDropDown from '@/components/MasterList/ComplianceRequirement/ComplianceRequirementActionDropDown';
import ComplianceRequirementList from '@/components/MasterList/ComplianceRequirement/ComplianceRequirementList';
import ComplianceRequirementWrapper from '@/components/MasterList/ComplianceRequirement/ComplianceRequirementWrapper';
import ComplianceObligationActionDropDown from '@/components/MasterList/ComplianceObligation/ComplianceObligationActionDropDown';
import ComplianceObligationList from '@/components/MasterList/ComplianceObligation/ComplianceObligationList';
import ComplianceObligationWrapper from '@/components/MasterList/ComplianceObligation/ComplianceObligationWrapper';
import ComplianceScopeActionDropDown from '@/components/MasterList/ComplianceScope/ComplianceScopeActionDropDown';
import ComplianceScopeList from '@/components/MasterList/ComplianceScope/ComplianceScopeList';
import ComplianceScopeWrapper from '@/components/MasterList/ComplianceScope/ComplianceScopeWrapper';
import QuestionnaireActionDropDown from '@/components/MasterList/Questionnaire/QuestionnaireActionDropDown';
import QuestionnaireList from '@/components/MasterList/Questionnaire/QuestionnaireList';
import QuestionnaireWrapper from '@/components/MasterList/Questionnaire/QuestionnaireWrapper';
import ApplicabilityRulesActionDropDown from '@/components/MasterList/ApplicabilityRules/ApplicabilityRulesActionDropDown';
import ApplicabilityRulesList from '@/components/MasterList/ApplicabilityRules/ApplicabilityRulesList';
import ApplicabilityRulesWrapper from '@/components/MasterList/ApplicabilityRules/ApplicabilityRulesWrapper';
import Search from '@/components/Search/Search';
import Sort from '@/components/Sort/Sort';
import SubNav from '@/components/SubNav/SubNav';
import CustomSelect from '@/components/CustomSelect/CustomSelect';
import { auth } from '@/lib/auth';
import { IDepartment } from '@/lib/interface/IDepartment.interface';
import { IIndicator } from '@/lib/interface/IIndicator.interface';
import { IIndustries } from '@/lib/interface/IIndustries.interface';
import { IMeta } from '@/lib/interface/IMeta.interface';
import { IThemes } from '@/lib/interface/IThemes.interface';
import { IQuestion } from '@/lib/interface/IQuestions.interface';
import { ISector } from '@/lib/interface/ISector.interface';
import { IStandard } from '@/lib/interface/IStandard.interface';
import { IComplianceRequirement } from '@/lib/interface/IComplianceRequirement.interface';
import { IComplianceObligation } from '@/lib/interface/IComplianceObligation.interface';
import { IComplianceScope } from '@/lib/interface/IComplianceScope.interface';
import { IQuestionnaire } from '@/lib/interface/IQuestionnaire.interface';
import { IApplicabilityRules } from '@/lib/interface/IApplicabilityRules.interface';
import { unstable_noStore as noStore } from 'next/cache';

import {
  AccountService,
  IndicatorsService,
  IndustryService,
  ThemeService,
  QuestionService,
  SectorService,
  StandardService,
  ThemeIndustriesService,
  ComplianceRequirementService,
  ComplianceObligationService,
  ComplianceScopeService,
  QuestionnaireService,
  ApplicabilityRulesService,
} from '@/lib/service';
import * as FileRepoService from '@/lib/service/fileRepo';
import {
  convertToPascalCase,
  formatDateList,
  getStatusColor,
  Params,
} from '@/lib/utils';
import { IThemesIndustries } from '@/lib/interface/IThemesIndustries.interface';

export interface IFileRepoFilter {
  company_name?: string;
  year?: string;
  report_name?: string;
  limit?: string; // ✅ string
  page?: string; // ✅ string
}

function renderTableRows<T>(
  data: T[],
  renderRow: (item: T) => React.ReactNode,
) {
  return data.map(renderRow);
}

function renderWithWrapper<T>({
  data,
  Wrapper,
  renderRow,
  ListComponent,
  listProps,
}: {
  data: T[];
  Wrapper: React.ComponentType<{ children: React.ReactNode }>;
  renderRow: (item: T) => React.ReactNode;
  ListComponent?: React.ComponentType<any>;
  listProps?: any;
}) {
  if (!data?.length) return <PageNotFound />;
  return (
    <>
      <Wrapper>{renderTableRows(data, renderRow)}</Wrapper>
      {ListComponent && <ListComponent {...listProps} />}
    </>
  );
}

export const dynamic = 'force-dynamic';

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: any;
}) {
  noStore();
  const session = await auth();
  const token = (session?.user as { accessToken: string })?.accessToken;

  const filterParams = {
    page: searchParams?.page || '1',
    limit: searchParams?.limit || '50',
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
    year: searchParams?.year || '',
    company_name: searchParams?.company_name || '',
  };

  let metaList: IMeta = {
    currentCount: 1,
    currentPage: '1',
    currentLimit: '10',
    totalCount: 1,
  };

  // eslint-disable-next-line react/no-unstable-nested-components
  async function RenderComponents() {
    switch (params?.slug) {
      case 'sectors': {
        const res = await SectorService.getAll(filterParams, token);
        const { sectors, meta } = res?.data as {
          sectors: ISector[];
          meta: IMeta;
        };
        metaList = meta;
        return renderWithWrapper<ISector>({
          data: sectors,
          Wrapper: SectorWrapper,
          renderRow: (sector) => (
            <tr key={sector.id} className="tableHover">
              <td>
                <div style={{ textTransform: 'capitalize' }}>
                  {sector?.name}
                </div>
              </td>
              <td>
                {sector?.industry?.map((item) => (
                  <div key={item?.id}>{item?.name}</div>
                ))}
              </td>
              <td>{formatDateList(sector.updatedAt)}</td>
              <td>
                <Badge
                  bg={getStatusColor(sector.status, true)}
                  className={getStatusColor(sector.status, false)}
                >
                  {sector?.status || '-'}
                </Badge>
              </td>
              <td className="text-center">
                <SectorActionDowpDown sector={sector} />
              </td>
            </tr>
          ),
          ListComponent: SectorList,
          listProps: { sectors },
        });
      }
      case 'industries': {
        const res = await IndustryService.getAll(filterParams, token);
        const { industries, meta } = res?.data as {
          industries: IIndustries[];
          meta: IMeta;
        };
        metaList = meta;
        return renderWithWrapper<IIndustries>({
          data: industries,
          Wrapper: IndustriesWrapper,
          renderRow: (industry) => (
            <tr key={industry.id} className="tableHover">
              <td>
                <div style={{ textTransform: 'capitalize' }}>
                  {industry?.name}
                </div>
              </td>
              <td>{industry?.sector?.name}</td>
              <td>{formatDateList(industry.updatedAt)}</td>
              <td>
                <Badge
                  bg={getStatusColor(industry.status, true)}
                  className={getStatusColor(industry.status, false)}
                >
                  {industry?.status || '-'}
                </Badge>
              </td>
              <td className="text-center">
                <IndustryActionDowpDown industry={industry} />
              </td>
            </tr>
          ),
          ListComponent: IndustryList,
          listProps: { industries },
        });
      }
      case 'category': {
        const categories = [
          {
            id: '1',
            name: 'Finance',
            description: 'Financial compliance and reporting requirements.',
            status: 'ACTIVE',
          },
          {
            id: '2',
            name: 'Human Resources',
            description: 'Employee policy and workforce compliance.',
            status: 'INACTIVE',
          },
        ];

        return renderWithWrapper<any>({
          data: categories,
          Wrapper: CategoryWrapper,
          renderRow: (category) => (
            <tr key={category.id} className="tableHover">
              <td>
                <div style={{ textTransform: 'capitalize' }}>
                  {category?.name || '-'}
                </div>
              </td>
              <td>{category?.description || '-'}</td>
              <td>
                <Badge
                  bg={getStatusColor(
                    category?.status === 'ACTIVE' ? 'ACTIVE' : 'DRAFT',
                    true,
                  )}
                  className={getStatusColor(
                    category?.status === 'ACTIVE' ? 'ACTIVE' : 'DRAFT',
                    false,
                  )}
                >
                  {category?.status || 'ACTIVE'}
                </Badge>
              </td>
              <td className="text-center">
                <CategoryActionDowpDown category={category} />
              </td>
            </tr>
          ),
          ListComponent: CategoryList,
          listProps: { categories },
        });
      }
      case 'act': {
        const acts = [
          {
            id: '1',
            name: 'Factories Act',
            description: 'Regulates working conditions and industrial safety.',
            category: 'Labour',
            frequency: 'Annual',
            due_date: '30-06-2026',
            short_name: 'FA',
            act_number: 'ACT-01',
            act_type: 'Labour',
            government_level: 'Central',
            jurisdiction: 'India',
            enactment_date: '1948-04-01',
            effective_from: '1948-04-01',
            effective_to: 'N/A',
            status: 'ACTIVE',
          },
          {
            id: '2',
            name: 'Payment of Gratuity Act',
            description: 'Covers gratuity payment to employees.',
            category: 'Employee Benefits',
            frequency: 'Quarterly',
            due_date: '15-03-2026',
            short_name: 'POG',
            act_number: 'ACT-02',
            act_type: 'Employee Benefit',
            government_level: 'Central',
            jurisdiction: 'India',
            enactment_date: '1972-09-21',
            effective_from: '1972-09-21',
            effective_to: 'N/A',
            status: 'INACTIVE',
          },
        ];

        return renderWithWrapper<any>({
          data: acts,
          Wrapper: ActWrapper,
          renderRow: (act) => (
            <tr key={act.id} className="tableHover">
              <td>
                <div style={{ textTransform: 'capitalize' }}>{act?.name || '-'}</div>
              </td>
              <td>{act?.category || '-'}</td>
              <td>{act?.due_date || '-'}</td>
              <td>{act?.act_number || '-'}</td>
              <td>{act?.government_level || '-'}</td>
              <td>{act?.jurisdiction || '-'}</td>
              <td>
                <Badge
                  bg={getStatusColor(
                    act?.status === 'ACTIVE' ? 'ACTIVE' : 'DRAFT',
                    true,
                  )}
                  className={getStatusColor(
                    act?.status === 'ACTIVE' ? 'ACTIVE' : 'DRAFT',
                    false,
                  )}
                >
                  {act?.status || 'ACTIVE'}
                </Badge>
              </td>
              <td className="text-center">
                <ActActionDowpDown act={act} />
              </td>
            </tr>
          ),
          ListComponent: ActList,
          listProps: { acts },
        });
      }
      case 'section': {
        const sections = [
          {
            id: '1',
            name: 'Working Hours',
            description: 'Requirements related to employee working hours.',
            act: 'Factories Act',
            sequence: '1',
            status: 'ACTIVE',
            updatedAt: '2026-09-22',
          },
          {
            id: '2',
            name: 'Leave Policy',
            description: 'Requirements related to employee leave policy.',
            act: 'Shops and Establishments Act',
            sequence: '2',
            status: 'INACTIVE',
            updatedAt: '2026-09-22',
          },
        ];

        return renderWithWrapper<any>({
          data: sections,
          Wrapper: SectionWrapper,
          renderRow: (section) => (
            <tr key={section.id} className="tableHover">
              <td>
                <div style={{ textTransform: 'capitalize' }}>
                  {section?.name || '-'}
                </div>
              </td>
              <td>{section?.description || '-'}</td>
              <td>{section?.act || '-'}</td>
              <td>{section?.sequence || '-'}</td>
              <td>
                <Badge
                  bg={getStatusColor(
                    section?.status === 'ACTIVE' ? 'ACTIVE' : 'DRAFT',
                    true,
                  )}
                  className={getStatusColor(
                    section?.status === 'ACTIVE' ? 'ACTIVE' : 'DRAFT',
                    false,
                  )}
                >
                  {section?.status || 'ACTIVE'}
                </Badge>
              </td>
              <td className="text-center">
                <SectionActionDowpDown section={section} />
              </td>
            </tr>
          ),
          ListComponent: SectionList,
          listProps: { sections },
        });
      }

      case 'indicators': {
        const res = await IndicatorsService.getAll(filterParams, token);
        const { indicators, meta } = res?.data as {
          indicators: IIndicator[];
          meta: IMeta;
        };
        metaList = meta;
        return renderWithWrapper<IIndicator>({
          data: indicators,
          Wrapper: IndicatorsWrapper,
          renderRow: (indicator) => (
            <tr key={indicator.id} className="tableHover">
              <td>
                <div style={{ textTransform: 'capitalize' }}>
                  {indicator?.name}
                </div>
              </td>
              <td>{formatDateList(indicator.updatedAt)}</td>
              <td>{indicator?.questions?.length || 0}</td>
              <td>
                <Badge
                  bg={getStatusColor(
                    indicator.is_deleted ? 'DELETED' : 'ACTIVE',
                    true,
                  )}
                  className={getStatusColor(
                    indicator.is_deleted ? 'DELETED' : 'ACTIVE',
                    false,
                  )}
                >
                  {indicator.is_deleted ? 'Deleted' : 'Active'}
                </Badge>
              </td>
              <td className="text-center">
                <IndicatorsActionDowpDown indicator={indicator} />
              </td>
            </tr>
          ),
          ListComponent: IndicatorsList,
          listProps: { indicators },
        });
      }
      case 'questions': {
        const res = await QuestionService.getAll(filterParams, token);
        const { questions, meta } = res?.data as {
          questions: IQuestion[];
          meta: IMeta;
        };
        metaList = meta;
        return renderWithWrapper<IQuestion>({
          data: questions,
          Wrapper: QuestionsWrapper,
          renderRow: (question) => (
            <tr key={question.id} className="tableHover">
              <td>
                <div style={{ textTransform: 'capitalize', width: '35%' }}>
                  {question?.title}
                </div>
              </td>
              <td>
                <h6
                  className="fw-semibold mb-0 text-start"
                  style={{ color: '#3485AE' }}
                >
                  {convertToPascalCase(
                    question?.question_type
                      ?.replace('_SELECT', ' ')
                      .replace('_', ' '),
                  )}
                </h6>
              </td>
              <td>{question?.indicator?.name}</td>
              <td>{question?.universal_question_id}</td>
              <td>{formatDateList(question.updatedAt)}</td>
              <td>
                <Badge
                  bg={getStatusColor(
                    question.is_deleted ? 'DELETED' : 'ACTIVE',
                    true,
                  )}
                  className={getStatusColor(
                    question.is_deleted ? 'DELETED' : 'ACTIVE',
                    false,
                  )}
                >
                  {question.is_deleted ? 'Deleted' : 'Active'}
                </Badge>
              </td>
              <td className="text-center">
                <QuestionsActionDowpDown question={question} />
              </td>
            </tr>
          ),
          ListComponent: QuestionsList,
          listProps: { questions },
        });
      }
      case 'roles': {
        const roleRes = await AccountService.accontRoleConfig(token);
        return <RolesAndAccess roleAccess={roleRes?.data} isMaster />;
      }
      case 'file_repo': {
        const res = await FileRepoService.getAll(filterParams, token);
        const apiData = res?.data?.data;

        const fileRepos = (apiData?.data || []) as any[];

        metaList = {
          currentCount: fileRepos.length,
          currentPage: String(apiData?.page ?? 1),
          currentLimit: String(apiData?.limit ?? 10),
          totalCount: apiData?.total ?? 0,
        };

        return renderWithWrapper({
          data: fileRepos,
          Wrapper: FileRepoWrapper,
          renderRow: (fileRepo: any) => (
            <tr key={fileRepo.id} className="tableHover">
              <td>{fileRepo.company_name || '-'}</td>
              <td>{fileRepo.year || '-'}</td>
              <td>{fileRepo.report_name || '-'}</td>
              <td>
                {fileRepo.file_url ? (
                  <a
                    href={fileRepo.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View file
                  </a>
                ) : (
                  '-'
                )}
              </td>
              <td>{formatDateList(fileRepo.updatedAt)}</td>
              <td>
                <Badge
                  bg={getStatusColor(
                    fileRepo.is_deleted ? 'DELETED' : 'ACTIVE',
                    true,
                  )}
                  className={getStatusColor(
                    fileRepo.is_deleted ? 'DELETED' : 'ACTIVE',
                    false,
                  )}
                >
                  {fileRepo.is_deleted ? 'Deleted' : 'Active'}
                </Badge>
              </td>
              <td className="text-center">
                <FileRepoDropdown fileRepo={fileRepo} />
              </td>
            </tr>
          ),
          ListComponent: FileRepoList,
          listProps: { fileRepos },
        });
      }

      case 'compliance_requirement': {
        const res = await ComplianceRequirementService.getAll(filterParams, token);
        const { complianceRequirements, meta } = (res?.data || {}) as {
          complianceRequirements: IComplianceRequirement[];
          meta: IMeta;
        };
        metaList = meta;
        return renderWithWrapper<IComplianceRequirement>({
          data: complianceRequirements,
          Wrapper: ComplianceRequirementWrapper,
          renderRow: (complianceRequirement) => (
            <tr key={complianceRequirement.id} className="tableHover">
              <td>
                <div style={{ textTransform: 'capitalize' }}>
                  {complianceRequirement?.name}
                </div>
              </td>
              <td>
                <div style={{ maxWidth: '400px', whiteSpace: 'normal' }}>
                  {complianceRequirement?.description || '-'}
                </div>
              </td>
              <td>{formatDateList(complianceRequirement.updatedAt)}</td>
              <td>
                <Badge
                  bg={getStatusColor(complianceRequirement.status, true)}
                  className={getStatusColor(complianceRequirement.status, false)}
                >
                  {complianceRequirement?.status || '-'}
                </Badge>
              </td>
              <td className="text-center">
                <ComplianceRequirementActionDropDown
                  complianceRequirement={complianceRequirement}
                />
              </td>
            </tr>
          ),
          ListComponent: ComplianceRequirementList,
          listProps: { complianceRequirements },
        });
      }

      case 'compliance_obligation': {
        const res = await ComplianceObligationService.getAll(filterParams, token);
        const { complianceObligations, meta } = (res?.data || {}) as {
          complianceObligations: IComplianceObligation[];
          meta: IMeta;
        };
        metaList = meta;
        return renderWithWrapper<IComplianceObligation>({
          data: complianceObligations,
          Wrapper: ComplianceObligationWrapper,
          renderRow: (complianceObligation) => (
            <tr key={complianceObligation.id} className="tableHover">
              <td>
                <div style={{ textTransform: 'capitalize' }}>
                  {complianceObligation?.name}
                </div>
              </td>
              <td>
                <div style={{ maxWidth: '350px', whiteSpace: 'normal' }}>
                  {complianceObligation?.description || '-'}
                </div>
              </td>
              <td>{complianceObligation?.section || '-'}</td>
              <td>
                <div style={{ maxWidth: '300px', whiteSpace: 'normal' }}>
                  {complianceObligation?.applicability_rule || '-'}
                </div>
              </td>
              <td>{formatDateList(complianceObligation.updatedAt)}</td>
              <td>
                <Badge
                  bg={getStatusColor(complianceObligation.status, true)}
                  className={getStatusColor(complianceObligation.status, false)}
                >
                  {complianceObligation?.status || '-'}
                </Badge>
              </td>
              <td className="text-center">
                <ComplianceObligationActionDropDown
                  complianceObligation={complianceObligation}
                />
              </td>
            </tr>
          ),
          ListComponent: ComplianceObligationList,
          listProps: { complianceObligations },
        });
      }

      case 'compliance_scope': {
        const res = await ComplianceScopeService.getAll(filterParams, token);
        const { complianceScopes, meta } = (res?.data || {}) as {
          complianceScopes: IComplianceScope[];
          meta: IMeta;
        };
        metaList = meta;
        return renderWithWrapper<IComplianceScope>({
          data: complianceScopes,
          Wrapper: ComplianceScopeWrapper,
          renderRow: (complianceScope) => (
            <tr key={complianceScope.id} className="tableHover">
              <td>
                <div style={{ textTransform: 'capitalize' }}>
                  {complianceScope?.name}
                </div>
              </td>
              <td>
                <div style={{ maxWidth: '400px', whiteSpace: 'normal' }}>
                  {complianceScope?.description || '-'}
                </div>
              </td>
              <td>{complianceScope?.compliance_obligation || '-'}</td>
              <td>{formatDateList(complianceScope.updatedAt)}</td>
              <td>
                <Badge
                  bg={getStatusColor(complianceScope.status, true)}
                  className={getStatusColor(complianceScope.status, false)}
                >
                  {complianceScope?.status || '-'}
                </Badge>
              </td>
              <td className="text-center">
                <ComplianceScopeActionDropDown
                  complianceScope={complianceScope}
                />
              </td>
            </tr>
          ),
          ListComponent: ComplianceScopeList,
          listProps: { complianceScopes },
        });
      }

      case 'questionnaire': {
        const res = await QuestionnaireService.getAll(filterParams, token);
        const { questionnaires, meta } = (res?.data || {}) as {
          questionnaires: IQuestionnaire[];
          meta: IMeta;
        };
        metaList = meta;
        return renderWithWrapper<IQuestionnaire>({
          data: questionnaires,
          Wrapper: QuestionnaireWrapper,
          renderRow: (questionnaire) => (
            <tr key={questionnaire.id} className="tableHover">
              <td>
                <div style={{ textTransform: 'capitalize', maxWidth: '350px', whiteSpace: 'normal' }}>
                  {questionnaire?.title}
                </div>
              </td>
              <td>
                <h6
                  className="fw-semibold mb-0 text-start"
                  style={{ color: '#3485AE' }}
                >
                  {convertToPascalCase(
                    questionnaire?.type
                      ?.replace('_SELECT', ' ')
                      ?.replace('_', ' ') || '',
                  )}
                </h6>
              </td>
              <td>{questionnaire?.compliance_scope || '-'}</td>
              <td>
                <span className="fw-medium text-dark">{questionnaire?.universal_question_id || '-'}</span>
              </td>
              <td>{formatDateList(questionnaire.updatedAt)}</td>
              <td>
                <Badge
                  bg={getStatusColor(questionnaire.status, true)}
                  className={getStatusColor(questionnaire.status, false)}
                >
                  {questionnaire?.status || '-'}
                </Badge>
              </td>
              <td className="text-center">
                <QuestionnaireActionDropDown
                  questionnaire={questionnaire}
                />
              </td>
            </tr>
          ),
          ListComponent: QuestionnaireList,
          listProps: { questionnaires },
        });
      }

      case 'applicability_rules': {
        const res = await ApplicabilityRulesService.getAll(filterParams, token);
        const { applicabilityRules, meta } = (res?.data || {}) as {
          applicabilityRules: IApplicabilityRules[];
          meta: IMeta;
        };
        metaList = meta;
        return renderWithWrapper<IApplicabilityRules>({
          data: applicabilityRules,
          Wrapper: ApplicabilityRulesWrapper,
          renderRow: (applicabilityRule) => (
            <tr key={applicabilityRule.id} className="tableHover">
              <td>
                <div style={{ textTransform: 'capitalize', fontWeight: 500 }}>
                  {applicabilityRule?.name}
                </div>
              </td>
              <td>
                <div style={{ maxWidth: '180px', whiteSpace: 'normal' }}>
                  {Array.isArray(applicabilityRule?.sector)
                    ? applicabilityRule.sector.join(', ')
                    : applicabilityRule?.sector || '-'}
                </div>
              </td>
              <td>
                <div style={{ maxWidth: '180px', whiteSpace: 'normal' }}>
                  {Array.isArray(applicabilityRule?.industries)
                    ? applicabilityRule.industries.join(', ')
                    : applicabilityRule?.industries || '-'}
                </div>
              </td>
              <td>
                {Array.isArray(applicabilityRule?.state)
                  ? applicabilityRule.state.join(', ')
                  : applicabilityRule?.state || '-'}
              </td>
              <td>
                {Array.isArray(applicabilityRule?.listing_status)
                  ? applicabilityRule.listing_status.join(', ')
                  : applicabilityRule?.listing_status || '-'}
              </td>
              <td>{applicabilityRule?.employee_count || '-'}</td>
              <td>{applicabilityRule?.revenue_band || '-'}</td>
              <td>{formatDateList(applicabilityRule.updatedAt)}</td>
              <td>
                <Badge
                  bg={getStatusColor(applicabilityRule.status, true)}
                  className={getStatusColor(applicabilityRule.status, false)}
                >
                  {applicabilityRule?.status || '-'}
                </Badge>
              </td>
              <td className="text-center">
                <ApplicabilityRulesActionDropDown
                  applicabilityRule={applicabilityRule}
                />
              </td>
            </tr>
          ),
          ListComponent: ApplicabilityRulesList,
          listProps: { applicabilityRules },
        });
      }

      default:
        return <PageNotFound />;
    }
  }

  return (
    <div>
      <SubNav activePage={params?.slug} />
      <PageWrapper
        stackComponent={
          params.slug !== 'roles' ? (
            <div className="d-flex align-items-center">
              <div className="desktop-search w-100 me-3">
                <Search params={filterParams as Params} />
              </div>
              <div className="desktop-search" style={{ minWidth: '200px' }}>
                <Sort params={filterParams as Params} />
              </div>
              <div className="common-sort ms-3">
                <Filter>
                  <MasterFilter params={filterParams} slug={params?.slug} />
                </Filter>
              </div>
              <div className="mt-2 ms-2">
                <InviteButton
                  btnName={convertToPascalCase(
                    params?.slug?.replace('_', ' ') || '',
                  )}
                />
              </div>
              {['questions', 'sectors', 'industries']?.includes(
                params?.slug,
              ) && (
                <div className="mt-2 ms-2">
                  <InviteButton
                    btnName={convertToPascalCase(
                      params?.slug?.replace('_', ' ') || '',
                    )}
                    isUpload
                  />
                </div>
              )}
            </div>
          ) : (
            <div />
          )
        }
      >
        <div className="common-mobile-searchsection mb-3">
          <Search params={params as Params} />
        </div>
        {await RenderComponents()}
        {metaList && params.slug !== 'roles' && (
          <div className="my-4 pagination_padding">
            <Pagination
              meta={metaList}
              currentPage={searchParams?.page || '1'}
              component={convertToPascalCase(
                params?.slug?.replaceAll('_', ' ') || '',
              )}
            />
          </div>
        )}

        <div className="d-lg-none d-md-block">
          <MobileFilter params={filterParams} />
        </div>
      </PageWrapper>
    </div>
  );
}
