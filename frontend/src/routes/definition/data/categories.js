export const categories = [
    {
        table: "person",
        columns: [
            { name: "person_id", type: "upload" },
            { name: "gender_concept_id", type: "select" },
            { name: "year_of_birth", type: "range" },
            { name: "month_of_birth", type: "select" },
            { name: "day_of_birth", type: "select" },
            { name: "birth_datetime", type: "datetime" },
            { name: "race_concept_id", type: "select" },
            { name: "ethnicity_concept_id", type: "select" },
            { name: "location_id", type: "lookup" },
            { name: "provider_id", type: "lookup" },
            { name: "care_site_id", type: "lookup" },
            { name: "person_source_value", type: "lookup" },
            { name: "gender_source_value", type: "lookup" },
            { name: "gender_source_concept_id", type: "select" },
            { name: "race_source_value", type: "lookup" },
            { name: "race_source_concept_id", type: "select" },
            { name: "ethnicity_source_value", type: "lookup" },
            { name: "ethnicity_source_concept_id", type: "select" }
        ]
    },
    {
        table: "observation_period",
        columns: [
            { name: "observation_period_id", type: "lookup" },
            { name: "person_id", type: "lookup" },
            { name: "observation_period_start_date", type: "date" },
            { name: "observation_period_end_date", type: "date" },
            { name: "period_type_concept_id", type: "select" }
        ]
    },
    {
        table: "visit_occurrence",
        columns: [
            { name: "visit_occurrence_id", type: "lookup" },
            { name: "person_id", type: "lookup" },
            { name: "visit_concept_id", type: "select" },
            { name: "visit_start_date", type: "date" },
            { name: "visit_start_datetime", type: "datetime" },
            { name: "visit_end_date", type: "date" },
            { name: "visit_end_datetime", type: "datetime" },
            { name: "visit_type_concept_id", type: "select" },
            { name: "provider_id", type: "lookup" },
            { name: "care_site_id", type: "lookup" },
            { name: "visit_source_value", type: "lookup" },
            { name: "visit_source_concept_id", type: "select" },
            { name: "admitted_from_concept_id", type: "select" },
            { name: "admitted_from_source_value", type: "lookup" },
            { name: "discharged_to_concept_id", type: "select" },
            { name: "discharged_to_source_value", type: "lookup" },
            { name: "preceding_visit_occurrence_id", type: "lookup" }
        ]
    },
    {
        table: "visit_detail",
        columns: [
            { name: "visit_detail_id", type: "lookup" },
            { name: "person_id", type: "lookup" },
            { name: "visit_detail_concept_id", type: "select" },
            { name: "visit_detail_start_date", type: "date" },
            { name: "visit_detail_start_datetime", type: "datetime" },
            { name: "visit_detail_end_date", type: "date" },
            { name: "visit_detail_end_datetime", type: "datetime" },
            { name: "visit_detail_type_concept_id", type: "select" },
            { name: "provider_id", type: "lookup" },
            { name: "care_site_id", type: "lookup" },
            { name: "visit_detail_source_value", type: "lookup" },
            { name: "visit_detail_source_concept_id", type: "select" },
            { name: "admitted_from_concept_id", type: "select" },
            { name: "admitted_from_source_value", type: "lookup" },
            { name: "discharged_to_source_value", type: "lookup" },
            { name: "discharged_to_concept_id", type: "select" },
            { name: "preceding_visit_detail_id", type: "lookup" },
            { name: "parent_visit_detail_id", type: "lookup" },
            { name: "visit_occurrence_id", type: "lookup" }
        ]
    },
    {
        table: "condition_occurrence",
        columns: [
            { name: "condition_occurrence_id", type: "lookup" },
            { name: "person_id", type: "lookup" },
            { name: "condition_concept_id", type: "select" },
            { name: "condition_start_date", type: "date" },
            { name: "condition_start_datetime", type: "datetime" },
            { name: "condition_end_date", type: "date" },
            { name: "condition_end_datetime", type: "datetime" },
            { name: "condition_type_concept_id", type: "select" },
            { name: "condition_status_concept_id", type: "select" },
            { name: "stop_reason", type: "lookup" },
            { name: "provider_id", type: "lookup" },
            { name: "visit_occurrence_id", type: "lookup" },
            { name: "visit_detail_id", type: "lookup" },
            { name: "condition_source_value", type: "lookup" },
            { name: "condition_source_concept_id", type: "select" },
            { name: "condition_status_source_value", type: "lookup" },
            { name: "ext_cond_type_1_concept_id", type: "select" },
            { name: "ext_cond_type_2_concept_id", type: "select" },
            { name: "ext_cond_source_value_kcd", type: "lookup" },
            { name: "ext_cond_source_value_cc_text", type: "lookup" }
        ]
    },
    {
        table: "drug_exposure",
        columns: [
            { name: "drug_exposure_id", type: "lookup" },
            { name: "person_id", type: "lookup" },
            { name: "drug_concept_id", type: "select" },
            { name: "drug_exposure_start_date", type: "date" },
            { name: "drug_exposure_start_datetime", type: "datetime" },
            { name: "drug_exposure_end_date", type: "date" },
            { name: "drug_exposure_end_datetime", type: "datetime" },
            { name: "verbatim_end_date", type: "date" },
            { name: "drug_type_concept_id", type: "select" },
            { name: "stop_reason", type: "lookup" },
            { name: "refills", type: "range" },
            { name: "quantity", type: "range" },
            { name: "days_supply", type: "range" },
            { name: "sig", type: "lookup" },
            { name: "route_concept_id", type: "select" },
            { name: "lot_number", type: "lookup" },
            { name: "provider_id", type: "lookup" },
            { name: "visit_occurrence_id", type: "lookup" },
            { name: "visit_detail_id", type: "lookup" },
            { name: "drug_source_value", type: "lookup" },
            { name: "drug_source_concept_id", type: "select" },
            { name: "route_source_value", type: "lookup" },
            { name: "dose_unit_source_value", type: "lookup" },
            { name: "dose_unit_concept_id", type: "select" },
            { name: "atc_cd", type: "lookup" },
            { name: "ext_quantity", type: "range" },
            { name: "ret_quantity", type: "range" },
            { name: "effective_drug_dose", type: "lookup" }
        ]
    },
    {
        table: "procedure_occurrence",
        columns: [
            { name: "procedure_occurrence_id", type: "lookup" },
            { name: "person_id", type: "lookup" },
            { name: "procedure_concept_id", type: "select" },
            { name: "procedure_date", type: "date" },
            { name: "procedure_datetime", type: "datetime" },
            { name: "procedure_end_date", type: "date" },
            { name: "procedure_end_datetime", type: "datetime" },
            { name: "procedure_type_concept_id", type: "select" },
            { name: "modifier_concept_id", type: "select" },
            { name: "quantity", type: "range" },
            { name: "provider_id", type: "lookup" },
            { name: "visit_occurrence_id", type: "lookup" },
            { name: "visit_detail_id", type: "lookup" },
            { name: "procedure_source_value", type: "lookup" },
            { name: "procedure_source_concept_id", type: "select" },
            { name: "modifier_source_value", type: "lookup" }
        ]
    },
    {
        table: "device_exposure",
        columns: [
            { name: "device_exposure_id", type: "lookup" },
            { name: "person_id", type: "lookup" },
            { name: "device_concept_id", type: "select" },
            { name: "device_exposure_start_date", type: "date" },
            { name: "device_exposure_start_datetime", type: "datetime" },
            { name: "device_exposure_end_date", type: "date" },
            { name: "device_exposure_end_datetime", type: "datetime" },
            { name: "device_type_concept_id", type: "select" },
            { name: "unique_device_id", type: "lookup" },
            { name: "production_id", type: "lookup" },
            { name: "quantity", type: "range" },
            { name: "provider_id", type: "lookup" },
            { name: "visit_occurrence_id", type: "lookup" },
            { name: "visit_detail_id", type: "lookup" },
            { name: "device_source_value", type: "lookup" },
            { name: "device_source_concept_id", type: "select" },
            { name: "unit_concept_id", type: "select" },
            { name: "unit_source_value", type: "lookup" },
            { name: "unit_source_concept_id", type: "select" }
        ]
    },
    {
        table: "measurement",
        columns: [
            { name: "measurement_id", type: "lookup" },
            { name: "person_id", type: "lookup" },
            { name: "measurement_concept_id", type: "select" },
            { name: "measurement_date", type: "date" },
            { name: "measurement_datetime", type: "datetime" },
            { name: "measurement_time", type: "lookup" },
            { name: "measurement_type_concept_id", type: "select" },
            { name: "operator_concept_id", type: "select" },
            { name: "value_as_number", type: "range" },
            { name: "value_as_concept_id", type: "select" },
            { name: "unit_concept_id", type: "select" },
            { name: "range_low", type: "range" },
            { name: "range_high", type: "range" },
            { name: "provider_id", type: "lookup" },
            { name: "visit_occurrence_id", type: "lookup" },
            { name: "visit_detail_id", type: "lookup" },
            { name: "measurement_source_value", type: "lookup" },
            { name: "measurement_source_concept_id", type: "select" },
            { name: "unit_source_value", type: "lookup" },
            { name: "unit_source_concept_id", type: "select" },
            { name: "value_source_value", type: "lookup" },
            { name: "measurement_event_id", type: "lookup" },
            { name: "meas_event_field_concept_id", type: "select" },
            { name: "measurement_source_id", type: "lookup" }
        ]
    },
    {
        table: "observation",
        columns: [
            { name: "observation_id", type: "lookup" },
            { name: "person_id", type: "lookup" },
            { name: "observation_concept_id", type: "select" },
            { name: "observation_date", type: "date" },
            { name: "observation_datetime", type: "datetime" },
            { name: "observation_type_concept_id", type: "select" },
            { name: "value_as_number", type: "range" },
            { name: "value_as_string", type: "lookup" },
            { name: "value_as_concept_id", type: "select" },
            { name: "qualifier_concept_id", type: "select" },
            { name: "unit_concept_id", type: "select" },
            { name: "provider_id", type: "lookup" },
            { name: "visit_occurrence_id", type: "lookup" },
            { name: "visit_detail_id", type: "lookup" },
            { name: "observation_source_value", type: "lookup" },
            { name: "observation_source_concept_id", type: "select" },
            { name: "unit_source_value", type: "lookup" },
            { name: "qualifier_source_value", type: "lookup" },
            { name: "value_source_value", type: "lookup" },
            { name: "observation_event_id", type: "lookup" },
            { name: "obs_event_field_concept_id", type: "select" },
            { name: "ext_etc_source_value", type: "lookup" },
            { name: "ext_obs_value_subject_ccp_id", type: "select" }
        ]
    },
    {
        table: "death",
        columns: [
            { name: "person_id", type: "lookup" },
            { name: "death_date", type: "date" },
            { name: "death_datetime", type: "datetime" },
            { name: "death_type_concept_id", type: "select" },
            { name: "cause_concept_id", type: "select" },
            { name: "cause_source_value", type: "lookup" },
            { name: "cause_source_concept_id", type: "select" }
        ]
    },
    {
        table: "note",
        columns: [
            { name: "note_id", type: "lookup" },
            { name: "person_id", type: "lookup" },
            { name: "note_date", type: "date" },
            { name: "note_datetime", type: "datetime" },
            { name: "note_type_concept_id", type: "select" },
            { name: "note_class_concept_id", type: "select" },
            { name: "note_title", type: "lookup" },
            { name: "note_text", type: "lookup" },
            { name: "encoding_concept_id", type: "select" },
            { name: "language_concept_id", type: "select" },
            { name: "provider_id", type: "lookup" },
            { name: "visit_occurrence_id", type: "lookup" },
            { name: "visit_detail_id", type: "lookup" },
            { name: "note_source_value", type: "lookup" },
            { name: "note_event_id", type: "lookup" },
            { name: "note_event_field_concept_id", type: "select" },
            { name: "ext_format_id", type: "select" },
            { name: "ext_format_seq", type: "select" },
            { name: "ext_order_date", type: "date" },
            { name: "note_source_value2", type: "lookup" },
            { name: "note_source_value3", type: "lookup" },
            { name: "note_source_value4", type: "lookup" },
            { name: "provider_id2", type: "lookup" }
        ]
    },
    {
        table: "note_nlp",
        columns: [
            { name: "note_nlp_id", type: "lookup" },
            { name: "note_id", type: "lookup" },
            { name: "section_concept_id", type: "select" },
            { name: "snippet", type: "lookup" },
            { name: "offset", type: "lookup" },
            { name: "lexical_variant", type: "lookup" },
            { name: "note_nlp_concept_id", type: "select" },
            { name: "note_nlp_source_concept_id", type: "select" },
            { name: "nlp_system", type: "lookup" },
            { name: "nlp_date", type: "date" },
            { name: "nlp_datetime", type: "datetime" },
            { name: "term_exists", type: "lookup" },
            { name: "term_temporal", type: "lookup" },
            { name: "term_modifiers", type: "lookup" }
        ]
    },
    {
        table: "specimen",
        columns: [
            { name: "specimen_id", type: "lookup" },
            { name: "person_id", type: "lookup" },
            { name: "specimen_concept_id", type: "select" },
            { name: "specimen_type_concept_id", type: "select" },
            { name: "specimen_date", type: "date" },
            { name: "specimen_datetime", type: "datetime" },
            { name: "quantity", type: "range" },
            { name: "unit_concept_id", type: "select" },
            { name: "anatomic_site_concept_id", type: "select" },
            { name: "disease_status_concept_id", type: "select" },
            { name: "specimen_source_id", type: "lookup" },
            { name: "specimen_source_value", type: "lookup" },
            { name: "unit_source_value", type: "lookup" },
            { name: "anatomic_site_source_value", type: "lookup" },
            { name: "disease_status_source_value", type: "lookup" },
            { name: "measurement_acpt_no", type: "lookup" }
        ]
    },
    {
        table: "fact_relationship",
        columns: [
            { name: "domain_concept_id_1", type: "select" },
            { name: "fact_id_1", type: "lookup" },
            { name: "domain_concept_id_2", type: "select" },
            { name: "fact_id_2", type: "lookup" },
            { name: "relationship_concept_id", type: "select" }
        ]
    },
    {
        table: "location",
        columns: [
            { name: "location_id", type: "lookup" },
            { name: "address_1", type: "lookup" },
            { name: "address_2", type: "lookup" },
            { name: "city", type: "lookup" },
            { name: "state", type: "lookup" },
            { name: "zip", type: "lookup" },
            { name: "county", type: "lookup" },
            { name: "location_source_value", type: "lookup" },
            { name: "country_concept_id", type: "select" },
            { name: "country_source_value", type: "lookup" },
            { name: "latitude", type: "range" },
            { name: "longitude", type: "range" }
        ]
    },
    {
        table: "care_site",
        columns: [
            { name: "care_site_id", type: "lookup" },
            { name: "care_site_name", type: "lookup" },
            { name: "place_of_service_concept_id", type: "select" },
            { name: "location_id", type: "lookup" },
            { name: "care_site_source_value", type: "lookup" },
            { name: "place_of_service_source_value", type: "lookup" }
        ]
    },
    {
        table: "provider",
        columns: [
            { name: "provider_id", type: "lookup" },
            { name: "provider_name", type: "lookup" },
            { name: "npi", type: "lookup" },
            { name: "dea", type: "lookup" },
            { name: "specialty_concept_id", type: "select" },
            { name: "care_site_id", type: "lookup" },
            { name: "year_of_birth", type: "range" },
            { name: "gender_concept_id", type: "select" },
            { name: "provider_source_value", type: "lookup" },
            { name: "specialty_source_value", type: "lookup" },
            { name: "specialty_source_concept_id", type: "select" },
            { name: "gender_source_value", type: "lookup" },
            { name: "gender_source_concept_id", type: "select" }
        ]
    },
    {
        table: "payer_plan_period",
        columns: [
            { name: "payer_plan_period_id", type: "lookup" },
            { name: "person_id", type: "lookup" },
            { name: "payer_plan_period_start_date", type: "date" },
            { name: "payer_plan_period_end_date", type: "date" },
            { name: "payer_concept_id", type: "select" },
            { name: "payer_source_value", type: "lookup" },
            { name: "payer_source_concept_id", type: "select" },
            { name: "plan_concept_id", type: "select" },
            { name: "plan_source_value", type: "lookup" },
            { name: "plan_source_concept_id", type: "select" },
            { name: "sponsor_concept_id", type: "select" },
            { name: "sponsor_source_value", type: "lookup" },
            { name: "sponsor_source_concept_id", type: "select" },
            { name: "family_source_value", type: "lookup" },
            { name: "stop_reason_concept_id", type: "select" },
            { name: "stop_reason_source_value", type: "lookup" },
            { name: "stop_reason_source_concept_id", type: "select" }
        ]
    },
    {
        table: "cost",
        columns: [
            { name: "cost_id", type: "lookup" },
            { name: "cost_event_id", type: "lookup" },
            { name: "cost_domain_id", type: "lookup" },
            { name: "cost_type_concept_id", type: "select" },
            { name: "currency_concept_id", type: "select" },
            { name: "total_charge", type: "range" },
            { name: "total_cost", type: "range" },
            { name: "total_paid", type: "range" },
            { name: "paid_by_payer", type: "range" },
            { name: "paid_by_patient", type: "range" },
            { name: "paid_patient_copay", type: "range" },
            { name: "paid_patient_coinsurance", type: "range" },
            { name: "paid_patient_deductible", type: "range" },
            { name: "paid_by_primary", type: "range" },
            { name: "paid_ingredient_cost", type: "range" },
            { name: "paid_dispensing_fee", type: "range" },
            { name: "payer_plan_period_id", type: "lookup" },
            { name: "amount_allowed", type: "range" },
            { name: "revenue_code_concept_id", type: "select" },
            { name: "revenue_code_source_value", type: "lookup" },
            { name: "drg_concept_id", type: "select" },
            { name: "drg_source_value", type: "lookup" }
        ]
    },
    {
        table: "drug_era",
        columns: [
            { name: "drug_era_id", type: "lookup" },
            { name: "person_id", type: "lookup" },
            { name: "drug_concept_id", type: "select" },
            { name: "drug_era_start_date", type: "date" },
            { name: "drug_era_end_date", type: "date" },
            { name: "drug_exposure_count", type: "range" },
            { name: "gap_days", type: "range" }
        ]
    },
    {
        table: "dose_era",
        columns: [
            { name: "dose_era_id", type: "lookup" },
            { name: "person_id", type: "lookup" },
            { name: "drug_concept_id", type: "select" },
            { name: "unit_concept_id", type: "select" },
            { name: "dose_value", type: "range" },
            { name: "dose_era_start_date", type: "date" },
            { name: "dose_era_end_date", type: "date" }
        ]
    },
    {
        table: "condition_era",
        columns: [
            { name: "condition_era_id", type: "lookup" },
            { name: "person_id", type: "lookup" },
            { name: "condition_concept_id", type: "select" },
            { name: "condition_era_start_date", type: "date" },
            { name: "condition_era_end_date", type: "date" },
            { name: "condition_occurrence_count", type: "range" }
        ]
    },
    {
        table: "episode",
        columns: [
            { name: "episode_id", type: "lookup" },
            { name: "person_id", type: "lookup" },
            { name: "episode_concept_id", type: "select" },
            { name: "episode_start_date", type: "date" },
            { name: "episode_start_datetime", type: "datetime" },
            { name: "episode_end_date", type: "date" },
            { name: "episode_end_datetime", type: "datetime" },
            { name: "episode_parent_id", type: "lookup" },
            { name: "episode_number", type: "range" },
            { name: "episode_object_concept_id", type: "select" },
            { name: "episode_type_concept_id", type: "select" },
            { name: "episode_source_value", type: "lookup" },
            { name: "episode_source_concept_id", type: "select" }
        ]
    },
    {
        table: "episode_event",
        columns: [
            { name: "episode_id", type: "lookup" },
            { name: "event_id", type: "lookup" },
            { name: "episode_event_field_concept_id", type: "select" }
        ]
    },
    {
        table: "metadata",
        columns: [
            { name: "metadata_id", type: "lookup" },
            { name: "metadata_concept_id", type: "select" },
            { name: "metadata_type_concept_id", type: "select" },
            { name: "name", type: "lookup" },
            { name: "value_as_string", type: "lookup" },
            { name: "value_as_concept_id", type: "select" },
            { name: "value_as_number", type: "range" },
            { name: "metadata_date", type: "date" },
            { name: "metadata_datetime", type: "datetime" }
        ]
    },
    {
        table: "cdm_source",
        columns: [
            { name: "cdm_source_name", type: "lookup" },
            { name: "cdm_source_abbreviation", type: "lookup" },
            { name: "cdm_holder", type: "lookup" },
            { name: "source_description", type: "lookup" },
            { name: "source_documentation_reference", type: "lookup" },
            { name: "cdm_etl_reference", type: "lookup" },
            { name: "source_release_date", type: "date" },
            { name: "cdm_release_date", type: "date" },
            { name: "cdm_version", type: "lookup" },
            { name: "vocabulary_version", type: "lookup" },
            { name: "cdm_version_concept_id", type: "select" }
        ]
    },
    {
        table: "concept",
        columns: [
            { name: "concept_id", type: "lookup" },
            { name: "concept_name", type: "lookup" },
            { name: "domain_id", type: "lookup" },
            { name: "vocabulary_id", type: "lookup" },
            { name: "concept_class_id", type: "lookup" },
            { name: "standard_concept", type: "lookup" },
            { name: "concept_code", type: "lookup" },
            { name: "valid_start_date", type: "date" },
            { name: "valid_end_date", type: "date" },
            { name: "invalid_reason", type: "lookup" }
        ]
    },
    {
        table: "vocabulary",
        columns: [
            { name: "vocabulary_id", type: "lookup" },
            { name: "vocabulary_name", type: "lookup" },
            { name: "vocabulary_reference", type: "lookup" },
            { name: "vocabulary_version", type: "lookup" },
            { name: "vocabulary_concept_id", type: "select" }
        ]
    },
    {
        table: "domain",
        columns: [
            { name: "domain_id", type: "lookup" },
            { name: "domain_name", type: "lookup" },
            { name: "domain_concept_id", type: "select" }
        ]
    },
    {
        table: "concept_class",
        columns: [
            { name: "concept_class_id", type: "lookup" },
            { name: "concept_class_name", type: "lookup" },
            { name: "concept_class_concept_id", type: "select" }
        ]
    },
    {
        table: "concept_relationship",
        columns: [
            { name: "concept_id_1", type: "lookup" },
            { name: "concept_id_2", type: "lookup" },
            { name: "relationship_id", type: "lookup" },
            { name: "valid_start_date", type: "date" },
            { name: "valid_end_date", type: "date" },
            { name: "invalid_reason", type: "lookup" }
        ]
    },
    {
        table: "relationship",
        columns: [
            { name: "relationship_id", type: "lookup" },
            { name: "relationship_name", type: "lookup" },
            { name: "is_hierarchical", type: "lookup" },
            { name: "defines_ancestry", type: "lookup" },
            { name: "reverse_relationship_id", type: "lookup" },
            { name: "relationship_concept_id", type: "select" }
        ]
    },
    {
        table: "concept_synonym",
        columns: [
            { name: "concept_id", type: "lookup" },
            { name: "concept_synonym_name", type: "lookup" },
            { name: "language_concept_id", type: "select" }
        ]
    },
    {
        table: "concept_ancestor",
        columns: [
            { name: "ancestor_concept_id", type: "lookup" },
            { name: "descendant_concept_id", type: "lookup" },
            { name: "min_levels_of_separation", type: "range" },
            { name: "max_levels_of_separation", type: "range" }
        ]
    },
    {
        table: "source_to_concept_map",
        columns: [
            { name: "source_code", type: "lookup" },
            { name: "source_concept_id", type: "lookup" },
            { name: "source_vocabulary_id", type: "lookup" },
            { name: "source_code_description", type: "lookup" },
            { name: "target_concept_id", type: "lookup" },
            { name: "target_vocabulary_id", type: "lookup" },
            { name: "vaild_start_date", type: "date" },
            { name: "valid_end_date", type: "date" },
            { name: "invaild_reason", type: "lookup" }
        ]
    },
    {
        table: "drug_strength",
        columns: [
            { name: "drug_concept_id", type: "lookup" },
            { name: "ingredient_concept_id", type: "lookup" },
            { name: "amount_value", type: "range" },
            { name: "amount_unit_concept_id", type: "select" },
            { name: "numerator_value", type: "range" },
            { name: "numerator_unit_concept_id", type: "select" },
            { name: "denominator_value", type: "range" },
            { name: "denominator_unit_concept_id", type: "select" },
            { name: "box_size", type: "range" },
            { name: "valid_start_date", type: "date" },
            { name: "valid_end_date", type: "date" },
            { name: "invalid_reason", type: "lookup" }
        ]
    },
    {
        table: "cohort",
        columns: [
            { name: "cohort_definition_id", type: "lookup" },
            { name: "subject_id", type: "lookup" },
            { name: "cohort_start_date", type: "date" },
            { name: "cohort_end_date", type: "date" }
        ]
    },
    {
        table: "cohort_definition",
        columns: [
            { name: "cohort_definition_id", type: "lookup" },
            { name: "cohort_definition_name", type: "lookup" },
            { name: "cohort_definition_description", type: "lookup" },
            { name: "definition_type_concept_id", type: "select" },
            { name: "cohort_definition_syntax", type: "lookup" },
            { name: "subject_concept_id", type: "select" },
            { name: "cohort_initiation_date", type: "date" }
        ]
    },
    {
        table: "bio_signal",
        columns: [
            { name: "bio_signal_id", type: "lookup" },
            { name: "person_id", type: "lookup" },
            { name: "bio_signal_concept_id", type: "select" },
            { name: "bio_signal_source_value", type: "lookup" },
            { name: "bio_signal_date", type: "date" },
            { name: "bio_signal_datetime", type: "datetime" },
            { name: "file_path", type: "lookup" },
            { name: "visit_occurrence_id", type: "lookup" },
            { name: "event_id", type: "lookup" },
            { name: "event_field_concept_id", type: "select" }
        ]
    },
    {
        table: "note_endoscopy",
        columns: [
            { name: "note_id", type: "lookup" },
            { name: "ord_id", type: "lookup" },
            { name: "person_id", type: "lookup" },
            { name: "note_event_id", type: "lookup" },
            { name: "note_event_field_concept_id", type: "select" },
            { name: "note_date", type: "date" },
            { name: "note_datetime", type: "datetime" },
            { name: "note_type_concept_id", type: "lookup" },
            { name: "note_class_concept_id", type: "select" },
            { name: "note_title", type: "lookup" },
            { name: "note_text", type: "lookup" },
            { name: "encoding_concept_id", type: "lookup" },
            { name: "language_concept_id", type: "select" },
            { name: "provider_id", type: "lookup" },
            { name: "visit_occurrence_id", type: "lookup" },
            { name: "visit_detail_id", type: "lookup" },
            { name: "note_source_value", type: "lookup" },
            { name: "ext_format_id", type: "select" },
            { name: "ext_format_seq", type: "select" },
            { name: "ext_order_date", type: "date" },
            { name: "reg_dt", type: "date" },
            { name: "note_source_value2", type: "lookup" },
            { name: "note_source_value3", type: "lookup" },
            { name: "provider_id2", type: "lookup" }
        ]
    },
    {
        table: "source_to_concept_map_history",
        columns: [
            { name: "snuh_id", type: "lookup" },
            { name: "omop_concept_id", type: "select" },
            { name: "vocabulary", type: "lookup" },
            { name: "source_name", type: "lookup" },
            { name: "domain", type: "lookup" },
            { name: "mappedby", type: "lookup" },
            { name: "mappingstatus", type: "select" },
            { name: "primarychecker", type: "lookup" },
            { name: "pc_dept", type: "lookup" },
            { name: "secondarychecker", type: "lookup" },
            { name: "modifieddate", type: "datetime" },
            { name: "note", type: "lookup" },
            { name: "remark", type: "lookup" }
        ]
    }
]; 