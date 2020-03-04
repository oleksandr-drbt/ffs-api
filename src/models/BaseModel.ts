import { Model } from 'objection';
import { default as withVisibility } from 'objection-visibility';

class BaseModel extends withVisibility(Model) {
	constructor() {
		super();
	}
}

export default BaseModel;
