export interface TextProperty {
  publicId: 'trafficSigns_value' | 'main_sign_text' | 'trafficSigns_info';
  assetId: number;
  value: string | number | undefined;
}

/**
 * Used for both single- and multiple_choice_value,
 * as the additional properties for multi aren't needes as parameters.
 */
export interface ChoiceProperty {
  publicId:
    | 'structure'
    | 'condition'
    | 'size'
    | 'esterakennelma'
    | 'coating_type'
    | 'lane_type'
    | 'life_cycle'
    | 'type_of_damage'
    | 'urgency_of_repair'
    | 'location_specifier'
    | 'sign_material'
    | 'old_traffic_code';
  enumeratedValue: number;
  assetId: number;
}

export interface SignProperty {
  publicId: 'trafficSigns_type';
  enumeratedValue: string;
  assetId: number;
}

export interface NumberProperty {
  publicId: 'terrain_coordinates_x' | 'terrain_coordinates_y';
  assetId: number;
  value: number;
}

export interface AdditionalPanelProperty {
  lmTyyppi: string;
  assetId: number;
  position: number;
  value?: number;
  text?: string;
  size?: number;
  filmType?: number;
  color?: number;
}
