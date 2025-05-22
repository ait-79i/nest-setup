import { PartialType } from '@nestjs/swagger';
import { CreateStatutDto } from './create-statut.dto';

export class UpdateStatutDto extends PartialType(CreateStatutDto) {}
