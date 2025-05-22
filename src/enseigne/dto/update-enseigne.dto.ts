import { PartialType } from '@nestjs/swagger';
import { CreateEnseigneDto } from './create-enseigne.dto';

export class UpdateEnseigneDto extends PartialType(CreateEnseigneDto) {}
