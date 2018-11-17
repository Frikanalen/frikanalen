import logging
import os
import tempfile
import unittest

import move_and_process as mp


class ProcessConvert(unittest.TestCase):
    def test_basic_theora_convert(self):
        cmd, fn = mp.Converter.convert_cmds('/tmp/yadda/test.yey', 'theora')
        self.assertEqual(cmd[0], 'ffmpeg')
        self.assertIn('libtheora', cmd)
        self.assertEqual(cmd[-1], '/tmp/theora/test.ogv')
        self.assertEqual(cmd[-1], fn)

    def test_extensionless_convert(self):
        cmd, fn = mp.Converter.convert_cmds('/tmp/yadda/test', 'theora')
        self.assertEqual(cmd[0], 'ffmpeg')
        self.assertEqual(cmd[-1], '/tmp/theora/test.ogv')
        self.assertEqual(cmd[-1], fn)

    def test_basic_broadcast_convert(self):
        cmd, fn = mp.Converter.convert_cmds('/tmp/original/test.yey', 'broadcast')
        self.assertEqual(cmd[0], 'ffmpeg')
        self.assertIn('pal-dv', cmd)
        self.assertEqual(cmd[-1], '/tmp/broadcast/test.dv')
        self.assertEqual(cmd[-1], fn)


class ProcessRunner(unittest.TestCase):
    def test_basic_run(self):
        _, fn = tempfile.mkstemp()
        self.assertTrue(os.path.exists(fn))
        cmd = mp.Runner.run(['rm', fn])
        self.assertFalse(os.path.exists(fn))


class ProcessGenerate(unittest.TestCase):
    def setUp(self):
        logging.getLogger('').setLevel(logging.WARNING)

    def test_generate(self):
        tests = (
            ('/tmp/original/test.ogv', [
                '/tmp/large_thumb/test.jpg',
                '/tmp/broadcast/test.dv',
                '/tmp/theora/test.ogv']),
            ('/tmp/broadcast/test.ogv', [
                '/tmp/large_thumb/test.jpg',
                '/tmp/theora/test.ogv']),
        )
        nop = lambda *_: None
        for t in tests:
            in_fn, out_fns = t
            cmds = []

            mp.generate_videos(
                0, in_fn, runner_run=lambda c, _: cmds.append(c),
                register=nop)

            self.assertEqual(out_fns, [c[-1] for c in cmds])

    def test_generate_wrong_format(self):
        self.assertRaises(
            AssertionError, lambda: mp.generate_videos(0, '/a/b/c.d'))
        self.assertRaises(
            AssertionError, lambda: mp.generate_videos(0, '/a/theora/c.d'))


if __name__ == '__main__':
    unittest.main()
