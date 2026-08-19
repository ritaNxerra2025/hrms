import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from './common/decorators/public.decorator';

@ApiTags('Health')
@Controller()
export class AppController {
  @Public()
  @Get()
  @ApiOperation({ summary: 'Service health check' })
  health(): {
    status: string;
    service: string;
    timestamp: string;
  } {
    return {
      status: 'ok',
      service: 'nxerra-hrms-backend',
      timestamp: new Date().toISOString(),
    };
  }
}
