import { describe, it, expect, vi } from 'vitest';
import { logger } from '@core-plugin/modules/env/logger';
import { Filepath } from '@core-plugin/modules/env/path';
import * as fsModule from '@core-plugin/modules/env/fs';

describe('Logger Environment module', () => {
  it('setpath correctly sets a new execution log path', () => {
    const mockMkdir = vi.spyOn(Filepath.prototype, 'mkdir').mockImplementation(() => true);
    
    // Trigger setpath
    logger.setpath('customLogPath/log.txt');
    expect(mockMkdir).toHaveBeenCalled();
    mockMkdir.mockRestore();
  });

  it('write attempts to write sync over the mocked fs', () => {
    const dummyFs = { writeFileSync: vi.fn(), appendFileSync: vi.fn(), mkdirSync: vi.fn() };
    vi.spyOn(fsModule, 'getFS').mockReturnValue(dummyFs as any);
    
    logger.setpath('tmp/log.txt'); // Configure path
    logger.write('Error report');
    
    expect(dummyFs.writeFileSync).toHaveBeenCalled();
  });

  it('append adds content via fs correctly', () => {
    const dummyFs = { writeFileSync: vi.fn(), appendFileSync: vi.fn(), mkdirSync: vi.fn() };
    vi.spyOn(fsModule, 'getFS').mockReturnValue(dummyFs as any);
    
    logger.setpath('tmp/log.txt'); 
    logger.append('Info report');
    
    expect(dummyFs.appendFileSync).toHaveBeenCalled();
  });
});
