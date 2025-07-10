export const categories = [
    {
        table: "bio_signal",
        columns: [
            { name: "bio_signal_concept_id", type: "select" },
            { name: "bio_signal_date", type: "date" },
            { name: "bio_signal_datetime", type: "datetime" },
            { name: "bio_signal_id", type: "lookup" },
            { name: "bio_signal_source_value", type: "lookup" },
            { name: "event_field_concept_id", type: "select" },
            { name: "event_id", type: "lookup" },
            { name: "file_path", type: "lookup" },
            { name: "person_id", type: "lookup" },
            { name: "visit_occurrence_id", type: "lookup" }
        ]
    },
    {
        table: "care_site",
        columns: [
            { name: "care_site_id", type: "lookup" },
            { name: "care_site_name", type: "lookup" },
            { name: "care_site_source_value", type: "lookup" },
            { name: "location_id", type: "lookup" },
            { name: "place_of_service_concept_id", type: "select" },
            { name: "place_of_service_source_value", type: "lookup" }
        ]
    },
    {
        table: "cdm_source",
        columns: [
            { name: "cdm_etl_reference", type: "lookup" },
            { name: "cdm_holder", type: "lookup" },
            { name: "cdm_release_date", type: "date" },
            { name: "cdm_source_abbreviation", type: "lookup" },
            { name: "cdm_source_name", type: "lookup" },
            { name: "cdm_version", type: "lookup" },
            { name: "cdm_version_concept_id", type: "select" },
            { name: "source_description", type: "lookup" },
            { name: "source_documentation_reference", type: "lookup" },
            { name: "source_release_date", type: "date" },
            { name: "vocabulary_version", type: "lookup" }
        ]
    },
    {
        table: "cohort",
        columns: [
            { name: "cohort_definition_id", type: "lookup" },
            { name: "cohort_end_date", type: "date" },
            { name: "cohort_start_date", type: "date" },
            { name: "subject_id", type: "lookup" }
        ]
    },
    {
        table: "cohort_definition",
        columns: [
            { name: "cohort_definition_description", type: "lookup" },
            { name: "cohort_definition_id", type: "lookup" },
            { name: "cohort_definition_name", type: "lookup" },
            { name: "cohort_definition_syntax", type: "lookup" },
            { name: "cohort_initiation_date", type: "date" },
            { name: "definition_type_concept_id", type: "select" },
            { name: "subject_concept_id", type: "select" }
        ]
    },
    {
        table: "concept",
        columns: [
            { name: "concept_class_id", type: "lookup" },
            { name: "concept_code", type: "lookup" },
            { name: "concept_id", type: "lookup" },
            { name: "concept_name", type: "lookup" },
            { name: "domain_id", type: "lookup" },
            { name: "invalid_reason", type: "lookup" },
            { name: "standard_concept", type: "lookup" },
            { name: "valid_end_date", type: "date" },
            { name: "valid_start_date", type: "date" },
            { name: "vocabulary_id", type: "lookup" }
        ]
    },
    {
        table: "concept_ancestor",
        columns: [
            { name: "ancestor_concept_id", type: "lookup" },
            { name: "descendant_concept_id", type: "lookup" },
            { name: "max_levels_of_separation", type: "range" },
            { name: "min_levels_of_separation", type: "range" }
        ]
    },
    {
        table: "concept_class",
        columns: [
            { name: "concept_class_concept_id", type: "select" },
            { name: "concept_class_id", type: "lookup" },
            { name: "concept_class_name", type: "lookup" }
        ]
    },
    {
        table: "concept_relationship",
        columns: [
            { name: "concept_id_1", type: "lookup" },
            { name: "concept_id_2", type: "lookup" },
            { name: "invalid_reason", type: "lookup" },
            { name: "relationship_id", type: "lookup" },
            { name: "valid_end_date", type: "date" },
            { name: "valid_start_date", type: "date" }
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
        table: "condition_era",
        columns: [
            { name: "condition_concept_id", type: "select" },
            { name: "condition_era_end_date", type: "date" },
            { name: "condition_era_id", type: "lookup" },
            { name: "condition_era_start_date", type: "date" },
            { name: "condition_occurrence_count", type: "range" },
            { name: "person_id", type: "lookup" }
        ]
    },
    {
        table: "condition_occurrence",
        columns: [
            { name: "condition_concept_id", type: "select" },
            { name: "condition_end_date", type: "date" },
            { name: "condition_end_datetime", type: "datetime" },
            { name: "condition_occurrence_id", type: "lookup" },
            { name: "condition_source_concept_id", type: "select" },
            { name: "condition_source_value", type: "lookup" },
            { name: "condition_start_date", type: "date" },
            { name: "condition_start_datetime", type: "datetime" },
            { name: "condition_status_concept_id", type: "select" },
            { name: "condition_status_source_value", type: "lookup" },
            { name: "condition_type_concept_id", type: "select" },
            { name: "ext_cond_source_value_cc_text", type: "lookup" },
            { name: "ext_cond_source_value_kcd", type: "lookup" },
            { name: "ext_cond_type_1_concept_id", type: "select" },
            { name: "ext_cond_type_2_concept_id", type: "select" },
            { name: "person_id", type: "lookup" },
            { name: "provider_id", type: "lookup" },
            { name: "stop_reason", type: "lookup" },
            { name: "visit_detail_id", type: "lookup" },
            { name: "visit_occurrence_id", type: "lookup" }
        ]
    },
    {
        table: "cost",
        columns: [
            { name: "amount_allowed", type: "range" },
            { name: "cost_domain_id", type: "lookup" },
            { name: "cost_event_id", type: "lookup" },
            { name: "cost_id", type: "lookup" },
            { name: "cost_type_concept_id", type: "select" },
            { name: "currency_concept_id", type: "select" },
            { name: "drg_concept_id", type: "select" },
            { name: "drg_source_value", type: "lookup" },
            { name: "paid_by_patient", type: "range" },
            { name: "paid_by_payer", type: "range" },
            { name: "paid_by_primary", type: "range" },
            { name: "paid_dispensing_fee", type: "range" },
            { name: "paid_ingredient_cost", type: "range" },
            { name: "paid_patient_coinsurance", type: "range" },
            { name: "paid_patient_copay", type: "range" },
            { name: "paid_patient_deductible", type: "range" },
            { name: "payer_plan_period_id", type: "lookup" },
            { name: "revenue_code_concept_id", type: "select" },
            { name: "revenue_code_source_value", type: "lookup" },
            { name: "total_charge", type: "range" },
            { name: "total_cost", type: "range" },
            { name: "total_paid", type: "range" }
        ]
    },
    {
        table: "death",
        columns: [
            { name: "cause_concept_id", type: "select" },
            { name: "cause_source_concept_id", type: "select" },
            { name: "cause_source_value", type: "lookup" },
            { name: "death_date", type: "date" },
            { name: "death_datetime", type: "datetime" },
            { name: "death_type_concept_id", type: "select" },
            { name: "person_id", type: "lookup" }
        ]
    },
    {
        table: "device_exposure",
        columns: [
            { name: "device_concept_id", type: "select" },
            { name: "device_exposure_end_date", type: "date" },
            { name: "device_exposure_end_datetime", type: "datetime" },
            { name: "device_exposure_id", type: "lookup" },
            { name: "device_exposure_start_date", type: "date" },
            { name: "device_exposure_start_datetime", type: "datetime" },
            { name: "device_source_concept_id", type: "select" },
            { name: "device_source_value", type: "lookup" },
            { name: "device_type_concept_id", type: "select" },
            { name: "person_id", type: "lookup" },
            { name: "production_id", type: "lookup" },
            { name: "provider_id", type: "lookup" },
            { name: "quantity", type: "range" },
            { name: "unique_device_id", type: "lookup" },
            { name: "unit_concept_id", type: "select" },
            { name: "unit_source_concept_id", type: "select" },
            { name: "unit_source_value", type: "lookup" },
            { name: "visit_detail_id", type: "lookup" },
            { name: "visit_occurrence_id", type: "lookup" }
        ]
    },
    {
        table: "domain",
        columns: [
            { name: "domain_concept_id", type: "select" },
            { name: "domain_id", type: "lookup" },
            { name: "domain_name", type: "lookup" }
        ]
    },
    {
        table: "dose_era",
        columns: [
            { name: "dose_era_end_date", type: "date" },
            { name: "dose_era_id", type: "lookup" },
            { name: "dose_era_start_date", type: "date" },
            { name: "dose_value", type: "range" },
            { name: "drug_concept_id", type: "select" },
            { name: "person_id", type: "lookup" },
            { name: "unit_concept_id", type: "select" }
        ]
    },
    {
        table: "drug_era",
        columns: [
            { name: "drug_concept_id", type: "select" },
            { name: "drug_era_end_date", type: "date" },
            { name: "drug_era_id", type: "lookup" },
            { name: "drug_era_start_date", type: "date" },
            { name: "drug_exposure_count", type: "range" },
            { name: "gap_days", type: "range" },
            { name: "person_id", type: "lookup" }
        ]
    },
    {
        table: "drug_exposure",
        columns: [
            { name: "atc_cd", type: "lookup" },
            { name: "days_supply", type: "range" },
            { name: "dose_unit_concept_id", type: "select" },
            { name: "dose_unit_source_value", type: "lookup" },
            { name: "drug_concept_id", type: "select" },
            { name: "drug_exposure_end_date", type: "date" },
            { name: "drug_exposure_end_datetime", type: "datetime" },
            { name: "drug_exposure_id", type: "lookup" },
            { name: "drug_exposure_start_date", type: "date" },
            { name: "drug_exposure_start_datetime", type: "datetime" },
            { name: "drug_source_concept_id", type: "select" },
            { name: "drug_source_value", type: "lookup" },
            { name: "drug_type_concept_id", type: "select" },
            { name: "effective_drug_dose", type: "lookup" },
            { name: "ext_quantity", type: "range" },
            { name: "lot_number", type: "lookup" },
            { name: "person_id", type: "lookup" },
            { name: "provider_id", type: "lookup" },
            { name: "quantity", type: "range" },
            { name: "refills", type: "range" },
            { name: "ret_quantity", type: "range" },
            { name: "route_concept_id", type: "select" },
            { name: "route_source_value", type: "lookup" },
            { name: "sig", type: "lookup" },
            { name: "stop_reason", type: "lookup" },
            { name: "verbatim_end_date", type: "date" },
            { name: "visit_detail_id", type: "lookup" },
            { name: "visit_occurrence_id", type: "lookup" }
        ]
    },
    {
        table: "drug_strength",
        columns: [
            { name: "amount_unit_concept_id", type: "select" },
            { name: "amount_value", type: "range" },
            { name: "box_size", type: "range" },
            { name: "denominator_unit_concept_id", type: "select" },
            { name: "denominator_value", type: "range" },
            { name: "drug_concept_id", type: "lookup" },
            { name: "ingredient_concept_id", type: "lookup" },
            { name: "invalid_reason", type: "lookup" },
            { name: "numerator_unit_concept_id", type: "select" },
            { name: "numerator_value", type: "range" },
            { name: "valid_end_date", type: "date" },
            { name: "valid_start_date", type: "date" }
        ]
    },
    {
        table: "episode",
        columns: [
            { name: "episode_concept_id", type: "select" },
            { name: "episode_end_date", type: "date" },
            { name: "episode_end_datetime", type: "datetime" },
            { name: "episode_id", type: "lookup" },
            { name: "episode_number", type: "range" },
            { name: "episode_object_concept_id", type: "select" },
            { name: "episode_parent_id", type: "lookup" },
            { name: "episode_source_concept_id", type: "select" },
            { name: "episode_source_value", type: "lookup" },
            { name: "episode_start_date", type: "date" },
            { name: "episode_start_datetime", type: "datetime" },
            { name: "episode_type_concept_id", type: "select" },
            { name: "person_id", type: "lookup" }
        ]
    },
    {
        table: "episode_event",
        columns: [
            { name: "episode_event_field_concept_id", type: "select" },
            { name: "episode_id", type: "lookup" },
            { name: "event_id", type: "lookup" }
        ]
    },
    {
        table: "fact_relationship",
        columns: [
            { name: "domain_concept_id_1", type: "select" },
            { name: "domain_concept_id_2", type: "select" },
            { name: "fact_id_1", type: "lookup" },
            { name: "fact_id_2", type: "lookup" },
            { name: "relationship_concept_id", type: "select" }
        ]
    },
    {
        table: "location",
        columns: [
            { name: "address_1", type: "lookup" },
            { name: "address_2", type: "lookup" },
            { name: "city", type: "lookup" },
            { name: "country_concept_id", type: "select" },
            { name: "country_source_value", type: "lookup" },
            { name: "county", type: "lookup" },
            { name: "latitude", type: "range" },
            { name: "location_id", type: "lookup" },
            { name: "location_source_value", type: "lookup" },
            { name: "longitude", type: "range" },
            { name: "state", type: "lookup" },
            { name: "zip", type: "lookup" }
        ]
    },
    {
        table: "measurement",
        columns: [
            { name: "meas_event_field_concept_id", type: "select" },
            { name: "measurement_concept_id", type: "select" },
            { name: "measurement_date", type: "date" },
            { name: "measurement_datetime", type: "datetime" },
            { name: "measurement_event_id", type: "lookup" },
            { name: "measurement_id", type: "lookup" },
            { name: "measurement_source_concept_id", type: "select" },
            { name: "measurement_source_id", type: "lookup" },
            { name: "measurement_source_value", type: "lookup" },
            { name: "measurement_time", type: "lookup" },
            { name: "measurement_type_concept_id", type: "select" },
            { name: "operator_concept_id", type: "select" },
            { name: "person_id", type: "lookup" },
            { name: "provider_id", type: "lookup" },
            { name: "range_high", type: "range" },
            { name: "range_low", type: "range" },
            { name: "unit_concept_id", type: "select" },
            { name: "unit_source_concept_id", type: "select" },
            { name: "unit_source_value", type: "lookup" },
            { name: "value_as_concept_id", type: "select" },
            { name: "value_as_number", type: "range" },
            { name: "value_source_value", type: "lookup" },
            { name: "visit_detail_id", type: "lookup" },
            { name: "visit_occurrence_id", type: "lookup" }
        ]
    },
    {
        table: "metadata",
        columns: [
            { name: "metadata_concept_id", type: "select" },
            { name: "metadata_date", type: "date" },
            { name: "metadata_datetime", type: "datetime" },
            { name: "metadata_id", type: "lookup" },
            { name: "metadata_type_concept_id", type: "select" },
            { name: "name", type: "lookup" },
            { name: "value_as_concept_id", type: "select" },
            { name: "value_as_number", type: "range" },
            { name: "value_as_string", type: "lookup" }
        ]
    },
    {
        table: "note",
        columns: [
            { name: "encoding_concept_id", type: "select" },
            { name: "ext_format_id", type: "select" },
            { name: "ext_format_seq", type: "select" },
            { name: "ext_order_date", type: "date" },
            { name: "language_concept_id", type: "select" },
            { name: "note_class_concept_id", type: "select" },
            { name: "note_date", type: "date" },
            { name: "note_datetime", type: "datetime" },
            { name: "note_event_field_concept_id", type: "select" },
            { name: "note_event_id", type: "lookup" },
            { name: "note_id", type: "lookup" },
            { name: "note_source_value", type: "lookup" },
            { name: "note_source_value2", type: "lookup" },
            { name: "note_source_value3", type: "lookup" },
            { name: "note_source_value4", type: "lookup" },
            { name: "note_text", type: "lookup" },
            { name: "note_title", type: "lookup" },
            { name: "note_type_concept_id", type: "select" },
            { name: "person_id", type: "lookup" },
            { name: "provider_id", type: "lookup" },
            { name: "provider_id2", type: "lookup" },
            { name: "visit_detail_id", type: "lookup" },
            { name: "visit_occurrence_id", type: "lookup" }
        ]
    },
    {
        table: "note_endoscopy",
        columns: [
            { name: "encoding_concept_id", type: "lookup" },
            { name: "ext_format_id", type: "select" },
            { name: "ext_format_seq", type: "select" },
            { name: "ext_order_date", type: "date" },
            { name: "language_concept_id", type: "select" },
            { name: "note_class_concept_id", type: "select" },
            { name: "note_date", type: "date" },
            { name: "note_datetime", type: "datetime" },
            { name: "note_event_field_concept_id", type: "select" },
            { name: "note_event_id", type: "lookup" },
            { name: "note_id", type: "lookup" },
            { name: "note_source_value", type: "lookup" },
            { name: "note_source_value2", type: "lookup" },
            { name: "note_source_value3", type: "lookup" },
            { name: "note_text", type: "lookup" },
            { name: "note_title", type: "lookup" },
            { name: "note_type_concept_id", type: "lookup" },
            { name: "ord_id", type: "lookup" },
            { name: "person_id", type: "lookup" },
            { name: "provider_id", type: "lookup" },
            { name: "provider_id2", type: "lookup" },
            { name: "reg_dt", type: "date" },
            { name: "visit_detail_id", type: "lookup" },
            { name: "visit_occurrence_id", type: "lookup" }
        ]
    },
    {
        table: "note_nlp",
        columns: [
            { name: "lexical_variant", type: "lookup" },
            { name: "nlp_date", type: "date" },
            { name: "nlp_datetime", type: "datetime" },
            { name: "nlp_system", type: "lookup" },
            { name: "note_id", type: "lookup" },
            { name: "note_nlp_concept_id", type: "select" },
            { name: "note_nlp_id", type: "lookup" },
            { name: "note_nlp_source_concept_id", type: "select" },
            { name: "offset", type: "lookup" },
            { name: "section_concept_id", type: "select" },
            { name: "snippet", type: "lookup" },
            { name: "term_exists", type: "lookup" },
            { name: "term_modifiers", type: "lookup" },
            { name: "term_temporal", type: "lookup" }
        ]
    },
    {
        table: "observation",
        columns: [
            { name: "ext_etc_source_value", type: "lookup" },
            { name: "ext_obs_value_subject_ccp_id", type: "select" },
            { name: "obs_event_field_concept_id", type: "select" },
            { name: "observation_concept_id", type: "select" },
            { name: "observation_date", type: "date" },
            { name: "observation_datetime", type: "datetime" },
            { name: "observation_event_id", type: "lookup" },
            { name: "observation_id", type: "lookup" },
            { name: "observation_source_concept_id", type: "select" },
            { name: "observation_source_value", type: "lookup" },
            { name: "observation_type_concept_id", type: "select" },
            { name: "person_id", type: "lookup" },
            { name: "provider_id", type: "lookup" },
            { name: "qualifier_concept_id", type: "select" },
            { name: "qualifier_source_value", type: "lookup" },
            { name: "unit_concept_id", type: "select" },
            { name: "unit_source_value", type: "lookup" },
            { name: "value_as_concept_id", type: "select" },
            { name: "value_as_number", type: "range" },
            { name: "value_as_string", type: "lookup" },
            { name: "value_source_value", type: "lookup" },
            { name: "visit_detail_id", type: "lookup" },
            { name: "visit_occurrence_id", type: "lookup" }
        ]
    },
    {
        table: "observation_period",
        columns: [
            { name: "observation_period_end_date", type: "date" },
            { name: "observation_period_id", type: "lookup" },
            { name: "observation_period_start_date", type: "date" },
            { name: "period_type_concept_id", type: "select" },
            { name: "person_id", type: "lookup" }
        ]
    },
    {
        table: "payer_plan_period",
        columns: [
            { name: "family_source_value", type: "lookup" },
            { name: "payer_concept_id", type: "select" },
            { name: "payer_plan_period_end_date", type: "date" },
            { name: "payer_plan_period_id", type: "lookup" },
            { name: "payer_plan_period_start_date", type: "date" },
            { name: "payer_source_concept_id", type: "select" },
            { name: "payer_source_value", type: "lookup" },
            { name: "person_id", type: "lookup" },
            { name: "plan_concept_id", type: "select" },
            { name: "plan_source_concept_id", type: "select" },
            { name: "plan_source_value", type: "lookup" },
            { name: "sponsor_concept_id", type: "select" },
            { name: "sponsor_source_concept_id", type: "select" },
            { name: "sponsor_source_value", type: "lookup" },
            { name: "stop_reason_concept_id", type: "select" },
            { name: "stop_reason_source_concept_id", type: "select" },
            { name: "stop_reason_source_value", type: "lookup" }
        ]
    },
    {
        table: "person",
        columns: [
            { name: "birth_datetime", type: "datetime" },
            { name: "care_site_id", type: "lookup" },
            { name: "day_of_birth", type: "select" },
            { name: "ethnicity_concept_id", type: "select" },
            { name: "ethnicity_source_concept_id", type: "select" },
            { name: "ethnicity_source_value", type: "lookup" },
            { name: "gender_concept_id", type: "select" },
            { name: "gender_source_concept_id", type: "select" },
            { name: "gender_source_value", type: "lookup" },
            { name: "location_id", type: "lookup" },
            { name: "month_of_birth", type: "select" },
            { name: "person_id", type: "upload" },
            { name: "person_source_value", type: "lookup" },
            { name: "provider_id", type: "lookup" },
            { name: "race_concept_id", type: "select" },
            { name: "race_source_concept_id", type: "select" },
            { name: "race_source_value", type: "lookup" },
            { name: "year_of_birth", type: "range" }
        ]
    },
    {
        table: "procedure_occurrence",
        columns: [
            { name: "modifier_concept_id", type: "select" },
            { name: "modifier_source_value", type: "lookup" },
            { name: "person_id", type: "lookup" },
            { name: "procedure_concept_id", type: "select" },
            { name: "procedure_date", type: "date" },
            { name: "procedure_datetime", type: "datetime" },
            { name: "procedure_end_date", type: "date" },
            { name: "procedure_end_datetime", type: "datetime" },
            { name: "procedure_occurrence_id", type: "lookup" },
            { name: "procedure_source_concept_id", type: "select" },
            { name: "procedure_source_value", type: "lookup" },
            { name: "procedure_type_concept_id", type: "select" },
            { name: "provider_id", type: "lookup" },
            { name: "quantity", type: "range" },
            { name: "visit_detail_id", type: "lookup" },
            { name: "visit_occurrence_id", type: "lookup" }
        ]
    },
    {
        table: "provider",
        columns: [
            { name: "care_site_id", type: "lookup" },
            { name: "dea", type: "lookup" },
            { name: "gender_concept_id", type: "select" },
            { name: "gender_source_concept_id", type: "select" },
            { name: "gender_source_value", type: "lookup" },
            { name: "npi", type: "lookup" },
            { name: "provider_id", type: "lookup" },
            { name: "provider_name", type: "lookup" },
            { name: "provider_source_value", type: "lookup" },
            { name: "specialty_concept_id", type: "select" },
            { name: "specialty_source_concept_id", type: "select" },
            { name: "specialty_source_value", type: "lookup" },
            { name: "year_of_birth", type: "range" }
        ]
    },
    {
        table: "relationship",
        columns: [
            { name: "defines_ancestry", type: "lookup" },
            { name: "is_hierarchical", type: "lookup" },
            { name: "relationship_concept_id", type: "select" },
            { name: "relationship_id", type: "lookup" },
            { name: "relationship_name", type: "lookup" },
            { name: "reverse_relationship_id", type: "lookup" }
        ]
    },
    {
        table: "source_to_concept_map",
        columns: [
            { name: "invaild_reason", type: "lookup" },
            { name: "source_code", type: "lookup" },
            { name: "source_code_description", type: "lookup" },
            { name: "source_concept_id", type: "lookup" },
            { name: "source_vocabulary_id", type: "lookup" },
            { name: "target_concept_id", type: "lookup" },
            { name: "target_vocabulary_id", type: "lookup" },
            { name: "vaild_start_date", type: "date" },
            { name: "valid_end_date", type: "date" }
        ]
    },
    {
        table: "source_to_concept_map_history",
        columns: [
            { name: "domain", type: "lookup" },
            { name: "mappedby", type: "lookup" },
            { name: "mappingstatus", type: "select" },
            { name: "modifieddate", type: "datetime" },
            { name: "note", type: "lookup" },
            { name: "omop_concept_id", type: "select" },
            { name: "pc_dept", type: "lookup" },
            { name: "primarychecker", type: "lookup" },
            { name: "remark", type: "lookup" },
            { name: "secondarychecker", type: "lookup" },
            { name: "snuh_id", type: "lookup" },
            { name: "source_name", type: "lookup" },
            { name: "vocabulary", type: "lookup" }
        ]
    },
    {
        table: "specimen",
        columns: [
            { name: "anatomic_site_concept_id", type: "select" },
            { name: "anatomic_site_source_value", type: "lookup" },
            { name: "disease_status_concept_id", type: "select" },
            { name: "disease_status_source_value", type: "lookup" },
            { name: "measurement_acpt_no", type: "lookup" },
            { name: "person_id", type: "lookup" },
            { name: "quantity", type: "range" },
            { name: "specimen_concept_id", type: "select" },
            { name: "specimen_date", type: "date" },
            { name: "specimen_datetime", type: "datetime" },
            { name: "specimen_id", type: "lookup" },
            { name: "specimen_source_id", type: "lookup" },
            { name: "specimen_source_value", type: "lookup" },
            { name: "specimen_type_concept_id", type: "select" },
            { name: "unit_concept_id", type: "select" },
            { name: "unit_source_value", type: "lookup" }
        ]
    },
    {
        table: "visit_detail",
        columns: [
            { name: "admitted_from_concept_id", type: "select" },
            { name: "admitted_from_source_value", type: "lookup" },
            { name: "care_site_id", type: "lookup" },
            { name: "discharged_to_concept_id", type: "select" },
            { name: "discharged_to_source_value", type: "lookup" },
            { name: "parent_visit_detail_id", type: "lookup" },
            { name: "person_id", type: "lookup" },
            { name: "preceding_visit_detail_id", type: "lookup" },
            { name: "provider_id", type: "lookup" },
            { name: "visit_detail_concept_id", type: "select" },
            { name: "visit_detail_end_date", type: "date" },
            { name: "visit_detail_end_datetime", type: "datetime" },
            { name: "visit_detail_id", type: "lookup" },
            { name: "visit_detail_source_concept_id", type: "select" },
            { name: "visit_detail_source_value", type: "lookup" },
            { name: "visit_detail_start_date", type: "date" },
            { name: "visit_detail_start_datetime", type: "datetime" },
            { name: "visit_detail_type_concept_id", type: "select" },
            { name: "visit_occurrence_id", type: "lookup" }
        ]
    },
    {
        table: "visit_occurrence",
        columns: [
            { name: "admitted_from_concept_id", type: "select" },
            { name: "admitted_from_source_value", type: "lookup" },
            { name: "care_site_id", type: "lookup" },
            { name: "discharged_to_concept_id", type: "select" },
            { name: "discharged_to_source_value", type: "lookup" },
            { name: "person_id", type: "lookup" },
            { name: "preceding_visit_occurrence_id", type: "lookup" },
            { name: "provider_id", type: "lookup" },
            { name: "visit_concept_id", type: "select" },
            { name: "visit_end_date", type: "date" },
            { name: "visit_end_datetime", type: "datetime" },
            { name: "visit_occurrence_id", type: "lookup" },
            { name: "visit_source_concept_id", type: "select" },
            { name: "visit_source_value", type: "lookup" },
            { name: "visit_start_date", type: "date" },
            { name: "visit_start_datetime", type: "datetime" },
            { name: "visit_type_concept_id", type: "select" }
        ]
    },
    {
        table: "vocabulary",
        columns: [
            { name: "vocabulary_concept_id", type: "select" },
            { name: "vocabulary_id", type: "lookup" },
            { name: "vocabulary_name", type: "lookup" },
            { name: "vocabulary_reference", type: "lookup" },
            { name: "vocabulary_version", type: "lookup" }
        ]
    }
]; 